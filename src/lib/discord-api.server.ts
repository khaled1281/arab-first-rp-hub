const API = "https://discord.com/api/v10";

export const GUILD_ID = "1183042468854382612";
export const ACTIVATED_ROLE_ID = "1474688962118291517";
export const ADMIN_ROLE_ID = "1475060298670014484";
export const LOG_CHANNEL_ID = "1505658892896702715";

function token(): string {
  const t = process.env["DISCORD_BOT_TOKEN"];
  if (!t) throw new Error("MISSING_BOT_TOKEN");
  return t;
}

async function api<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bot ${token()}`,
      "Content-Type": "application/json",
    },
    body: init?.body === undefined ? null : JSON.stringify(init.body),
  });
  let data: T | null = null;
  if (res.status !== 204) {
    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }
  }
  return { ok: res.ok, status: res.status, data };
}

export type GuildMember = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  roles: string[];
  createdAt: string;
};

type RawMember = {
  roles: string[];
  nick?: string | null;
  user: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
    bot?: boolean;
  };
};

export function avatarUrlFor(id: string, avatar?: string | null): string {
  return avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith("a_") ? "gif" : "png"}?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;
}

export function snowflakeDate(id: string): string {
  return new Date(Number((BigInt(id) >> 22n) + 1420070400000n)).toISOString();
}

function shape(m: RawMember): GuildMember {
  return {
    id: m.user.id,
    username: m.user.username,
    displayName: m.nick || m.user.global_name || m.user.username,
    avatarUrl: avatarUrlFor(m.user.id, m.user.avatar),
    roles: m.roles,
    createdAt: snowflakeDate(m.user.id),
  };
}

/** Find a guild member by their Discord username / display name. */
export async function findMemberByUsername(query: string): Promise<GuildMember | null> {
  const clean = query.trim().replace(/^@/, "").split("#")[0]!.toLowerCase();
  const { ok, data } = await api<RawMember[]>(
    `/guilds/${GUILD_ID}/members/search?limit=100&query=${encodeURIComponent(clean)}`,
  );
  if (!ok || !data?.length) return null;
  const candidates = data.filter((m) => !m.user.bot);
  const exact =
    candidates.find((m) => m.user.username.toLowerCase() === clean) ??
    candidates.find((m) => (m.user.global_name ?? "").toLowerCase() === clean) ??
    candidates.find((m) => (m.nick ?? "").toLowerCase() === clean);
  return exact ? shape(exact) : null;
}

export async function getMemberById(id: string): Promise<GuildMember | null> {
  const { ok, data } = await api<RawMember>(`/guilds/${GUILD_ID}/members/${id}`);
  return ok && data ? shape(data) : null;
}

export async function addRole(userId: string, roleId: string): Promise<boolean> {
  const { ok } = await api(`/guilds/${GUILD_ID}/members/${userId}/roles/${roleId}`, {
    method: "PUT",
  });
  return ok;
}

export async function setNickname(userId: string, nick: string): Promise<boolean> {
  const { ok } = await api(`/guilds/${GUILD_ID}/members/${userId}`, {
    method: "PATCH",
    body: { nick: nick.slice(0, 32) },
  });
  return ok;
}

export type Embed = Record<string, unknown>;

export async function sendChannelMessage(
  channelId: string,
  payload: { content?: string; embeds?: Embed[] },
): Promise<boolean> {
  const { ok } = await api(`/channels/${channelId}/messages`, { method: "POST", body: payload });
  return ok;
}

export async function sendDirectMessage(
  userId: string,
  payload: { content?: string; embeds?: Embed[] },
): Promise<boolean> {
  const dm = await api<{ id: string }>("/users/@me/channels", {
    method: "POST",
    body: { recipient_id: userId },
  });
  if (!dm.ok || !dm.data?.id) return false;
  return sendChannelMessage(dm.data.id, payload);
}
