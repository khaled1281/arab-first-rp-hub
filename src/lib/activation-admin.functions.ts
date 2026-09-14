import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { resolveSession } from "./activation.functions";

export type AdminApplication = {
  id: string;
  discordId: string;
  discordUsername: string;
  discordDisplayName: string | null;
  discordAvatarUrl: string | null;
  discordCreatedAt: string | null;
  realName: string;
  realAge: number;
  robloxUsername: string;
  robloxId: string | null;
  robloxCreatedAt: string | null;
  robloxAvatarUrl: string | null;
  createdAt: string;
};

async function requireAdmin(token: string) {
  const discordId = await resolveSession(token);
  if (!discordId) return { error: "NO_SESSION" as const };
  const discord = await import("./discord-api.server");
  const member = await discord.getMemberById(discordId);
  if (!member) return { error: "NOT_IN_GUILD" as const };
  if (!member.roles.includes(discord.ADMIN_ROLE_ID)) return { error: "FORBIDDEN" as const };
  return { member, discord };
}

export const listPendingApplications = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().min(10) }).parse(data))
  .handler(async ({ data }) => {
    const auth = await requireAdmin(data.token);
    if ("error" in auth) return { ok: false as const, error: auth.error };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("activation_applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    const apps: AdminApplication[] = (rows ?? []).map((r) => ({
      id: r.id,
      discordId: r.discord_id,
      discordUsername: r.discord_username,
      discordDisplayName: r.discord_display_name,
      discordAvatarUrl: r.discord_avatar_url,
      discordCreatedAt: r.discord_created_at,
      realName: r.real_name,
      realAge: r.real_age,
      robloxUsername: r.roblox_username,
      robloxId: r.roblox_id,
      robloxCreatedAt: r.roblox_created_at,
      robloxAvatarUrl: r.roblox_avatar_url,
      createdAt: r.created_at,
    }));

    return { ok: true as const, apps };
  });

function accountAge(iso: string | null): string {
  if (!iso) return "غير معروف";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years > 0) return `${years} سنة و ${months} شهر`;
  if (months > 0) return `${months} شهر`;
  return `${days} يوم`;
}

function fmt(iso: string | null): string {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "غير معروف";
}

export const decideApplication = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().min(10),
        id: z.string().uuid(),
        decision: z.enum(["approved", "rejected"]),
        reason: z.string().trim().max(300).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const auth = await requireAdmin(data.token);
    if ("error" in auth) return { ok: false as const, error: auth.error };
    const { member: admin, discord } = auth;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: app } = await supabaseAdmin
      .from("activation_applications")
      .select("*")
      .eq("id", data.id)
      .eq("status", "pending")
      .maybeSingle();
    if (!app) return { ok: false as const, error: "NOT_FOUND" };

    const approved = data.decision === "approved";
    const warnings: string[] = [];

    if (approved) {
      const roleOk = await discord.addRole(app.discord_id, discord.ACTIVATED_ROLE_ID);
      if (!roleOk) warnings.push("ROLE_FAILED");
      const nickOk = await discord.setNickname(app.discord_id, `AF | ${app.roblox_username}`);
      if (!nickOk) warnings.push("NICK_FAILED");
    }

    await supabaseAdmin
      .from("activation_applications")
      .update({
        status: data.decision,
        decided_by: admin.id,
        decided_by_username: admin.username,
        decided_at: new Date().toISOString(),
      })
      .eq("id", app.id);

    const fields = [
      { name: "الاسم الحقيقي", value: app.real_name, inline: true },
      { name: "العمر", value: String(app.real_age), inline: true },
      { name: "يوزر روبلوكس", value: app.roblox_username, inline: true },
      {
        name: "حساب روبلوكس",
        value: `${fmt(app.roblox_created_at)} • ${accountAge(app.roblox_created_at)}`,
        inline: true,
      },
      {
        name: "حساب ديسكورد",
        value: `${fmt(app.discord_created_at)} • ${accountAge(app.discord_created_at)}`,
        inline: true,
      },
      { name: "ديسكورد", value: `<@${app.discord_id}> (${app.discord_username})`, inline: true },
    ];

    const logEmbed: Record<string, unknown> = {
      title: approved ? "قبول تفعيل" : "رفض تفعيل",
      color: approved ? 0x2ecc71 : 0xe74c3c,
      description: approved
        ? `تم قبول <@${app.discord_id}> وإعطاؤه رتبة مفعل وتغيير اسمه إلى \`AF | ${app.roblox_username}\`.`
        : `تم رفض تقديم <@${app.discord_id}>، ويمكنه التقديم مرة أخرى.`,
      fields,
      thumbnail: app.roblox_avatar_url ? { url: app.roblox_avatar_url } : undefined,
      footer: { text: `القرار بواسطة ${admin.username}` },
      timestamp: new Date().toISOString(),
    };

    await discord.sendChannelMessage(discord.LOG_CHANNEL_ID, {
      content: `<@${admin.id}> — ${approved ? "قبل" : "رفض"} تقديم <@${app.discord_id}>`,
      embeds: [logEmbed],
    });

    await discord.sendDirectMessage(app.discord_id, {
      embeds: [
        {
          title: approved ? "تم قبول تقديمك ✅" : "تم رفض تقديمك ❌",
          color: approved ? 0x2ecc71 : 0xe74c3c,
          description: approved
            ? `مرحباً بك رسمياً في **Arab First RP**.\nتمت الموافقة على تقديمك، وأصبح لديك رتبة **مفعل**، وتم تغيير اسمك في السيرفر إلى \`AF | ${app.roblox_username}\`.\n\nنشوفك على الطريق، والتزم بالقوانين وستمّتع بالرول بلاي.`
            : `نعتذر، تقديمك للتفعيل في **Arab First RP** لم يتم قبوله هذه المرة.${
                data.reason ? `\n\n**السبب:** ${data.reason}` : ""
              }\n\nيمكنك التقديم مرة أخرى من الموقع بعد مراجعة بياناتك.`,
          fields: [
            { name: "يوزر روبلوكس", value: app.roblox_username, inline: true },
            { name: "تاريخ الطلب", value: fmt(app.created_at), inline: true },
          ],
          thumbnail: app.roblox_avatar_url ? { url: app.roblox_avatar_url } : undefined,
          footer: { text: "Arab First RP • EST. 2025" },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return { ok: true as const, warnings };
  });
