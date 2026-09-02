import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GUILD_ID = "1183042468854382612";

export type RoleMember = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};

/**
 * List every guild member that carries a given role, with real Discord avatars.
 * Reads DISCORD_BOT_TOKEN inside the handler; returns [] when unavailable.
 */
export const getRoleMembers = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ roleId: z.string().min(5) }).parse(data))
  .handler(async ({ data }): Promise<RoleMember[]> => {
    const token = process.env["DISCORD_BOT_TOKEN"];
    if (!token) return [];

    try {
      const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=1000`,
        { headers: { Authorization: `Bot ${token}` } },
      );
      if (!res.ok) return [];
      const members = (await res.json()) as Array<{
        roles: string[];
        nick?: string | null;
        user: {
          id: string;
          username: string;
          global_name?: string | null;
          avatar?: string | null;
          bot?: boolean;
        };
      }>;

      return members
        .filter((m) => !m.user.bot && m.roles.includes(data.roleId))
        .map((m) => {
          const u = m.user;
          const avatarUrl = u.avatar
            ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
            : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(u.id) >> 22n) % 6n)}.png`;
          return {
            id: u.id,
            username: u.username,
            displayName: m.nick || u.global_name || u.username,
            avatarUrl,
          };
        })
        .sort((a, b) => a.username.localeCompare(b.username));
    } catch {
      return [];
    }
  });
