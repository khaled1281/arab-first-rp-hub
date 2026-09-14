import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type VerifyState = {
  discordId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  createdAt: string;
  isActivated: boolean;
  isAdmin: boolean;
  application: { status: string; createdAt: string; robloxUsername: string } | null;
};

const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function randomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function randomToken(): string {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
}

/** Step 1 — look the Discord user up in the guild and DM them a 6-digit code. */
export const requestVerifyCode = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ username: z.string().trim().min(2).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const discord = await import("./discord-api.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let member: Awaited<ReturnType<typeof discord.findMemberByUsername>>;
    try {
      member = await discord.findMemberByUsername(data.username);
    } catch {
      return { ok: false as const, error: "BOT_UNAVAILABLE" };
    }
    if (!member) return { ok: false as const, error: "NOT_IN_GUILD" };

    const { data: recent } = await supabaseAdmin
      .from("verify_codes")
      .select("created_at")
      .eq("discord_id", member.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (recent && Date.now() - new Date(recent.created_at).getTime() < 45_000) {
      return { ok: false as const, error: "TOO_SOON" };
    }

    const code = randomCode();
    const { data: row, error } = await supabaseAdmin
      .from("verify_codes")
      .insert({
        discord_id: member.id,
        discord_username: member.username,
        code,
        expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
      })
      .select("id")
      .single();
    if (error || !row) return { ok: false as const, error: "SERVER" };

    const sent = await discord.sendDirectMessage(member.id, {
      embeds: [
        {
          title: "Arab First RP — كود التحقق",
          description: `أهلاً **${member.displayName}**\nهذا كود التحقق الخاص بك لتسجيل الدخول في موقع Arab First RP:\n\n# \`${code}\`\n\nالكود صالح لمدة **١٠ دقائق** فقط، ولا تشاركه مع أي شخص.`,
          color: 0xd4af37,
          footer: { text: "Arab First RP • EST. 2025" },
          timestamp: new Date().toISOString(),
        },
      ],
    });
    if (!sent) return { ok: false as const, error: "DM_CLOSED" };

    return {
      ok: true as const,
      requestId: row.id,
      username: member.username,
      avatarUrl: member.avatarUrl,
    };
  });

/** Step 2 — confirm the code and open a website session. */
export const confirmVerifyCode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ requestId: z.string().uuid(), code: z.string().trim().regex(/^\d{6}$/) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("verify_codes")
      .select("id, discord_id, code, attempts, used, expires_at")
      .eq("id", data.requestId)
      .maybeSingle();
    if (!row) return { ok: false as const, error: "INVALID" };
    if (row.used) return { ok: false as const, error: "USED" };
    if (new Date(row.expires_at).getTime() < Date.now())
      return { ok: false as const, error: "EXPIRED" };
    if (row.attempts >= 5) return { ok: false as const, error: "TOO_MANY" };

    if (row.code !== data.code) {
      await supabaseAdmin
        .from("verify_codes")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      return { ok: false as const, error: "WRONG_CODE" };
    }

    await supabaseAdmin.from("verify_codes").update({ used: true }).eq("id", row.id);

    const token = randomToken();
    const { error } = await supabaseAdmin.from("verify_sessions").insert({
      token,
      discord_id: row.discord_id,
      expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });
    if (error) return { ok: false as const, error: "SERVER" };

    return { ok: true as const, token };
  });

/** Resolve a session token to its Discord id, or null when invalid/expired. */
export async function resolveSession(token: string): Promise<string | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("verify_sessions")
    .select("discord_id, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;
  return data.discord_id;
}

/** Current state for the signed-in visitor: profile, activation, application. */
export const getVerifyState = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().min(10) }).parse(data))
  .handler(async ({ data }): Promise<{ ok: false; error: string } | { ok: true; state: VerifyState }> => {
    const discordId = await resolveSession(data.token);
    if (!discordId) return { ok: false, error: "NO_SESSION" };

    const discord = await import("./discord-api.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const member = await discord.getMemberById(discordId);
    if (!member) return { ok: false, error: "NOT_IN_GUILD" };

    const { data: app } = await supabaseAdmin
      .from("activation_applications")
      .select("status, created_at, roblox_username")
      .eq("discord_id", discordId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      ok: true,
      state: {
        discordId: member.id,
        username: member.username,
        displayName: member.displayName,
        avatarUrl: member.avatarUrl,
        createdAt: member.createdAt,
        isActivated: member.roles.includes(discord.ACTIVATED_ROLE_ID),
        isAdmin: member.roles.includes(discord.ADMIN_ROLE_ID),
        application: app
          ? { status: app.status, createdAt: app.created_at, robloxUsername: app.roblox_username }
          : null,
      },
    };
  });

/** Submit the activation application. */
export const submitActivation = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().min(10),
        realName: z.string().trim().min(2).max(80),
        realAge: z.coerce.number().int().min(8).max(99),
        robloxUsername: z.string().trim().min(3).max(30),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const discordId = await resolveSession(data.token);
    if (!discordId) return { ok: false as const, error: "NO_SESSION" };

    const discord = await import("./discord-api.server");
    const { getRobloxProfile } = await import("./roblox.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const member = await discord.getMemberById(discordId);
    if (!member) return { ok: false as const, error: "NOT_IN_GUILD" };
    if (member.roles.includes(discord.ACTIVATED_ROLE_ID))
      return { ok: false as const, error: "ALREADY_ACTIVATED" };

    const { data: existing } = await supabaseAdmin
      .from("activation_applications")
      .select("id, status")
      .eq("discord_id", discordId)
      .in("status", ["pending", "approved"])
      .limit(1)
      .maybeSingle();
    if (existing) return { ok: false as const, error: existing.status.toUpperCase() };

    const roblox = await getRobloxProfile(data.robloxUsername);
    if (!roblox) return { ok: false as const, error: "ROBLOX_NOT_FOUND" };

    const { error } = await supabaseAdmin.from("activation_applications").insert({
      discord_id: member.id,
      discord_username: member.username,
      discord_display_name: member.displayName,
      discord_avatar_url: member.avatarUrl,
      discord_created_at: member.createdAt,
      real_name: data.realName,
      real_age: data.realAge,
      roblox_username: roblox.username,
      roblox_id: roblox.id,
      roblox_created_at: roblox.createdAt,
      roblox_avatar_url: roblox.avatarUrl,
      status: "pending",
    });
    if (error) return { ok: false as const, error: "SERVER" };

    return { ok: true as const };
  });
