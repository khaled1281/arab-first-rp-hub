import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type AvatarMap = Record<string, string>;

/**
 * Resolve real Discord avatar URLs for a list of user IDs.
 *
 * Discord's CDN needs each user's avatar hash, which is only available via the
 * authenticated bot API. Reads the DISCORD_BOT_TOKEN secret inside the handler.
 * Returns a map of { userId -> avatarUrl }. When no token is configured (or a
 * fetch fails) the user is simply omitted from the map, so callers fall back
 * to the default Discord avatar.
 */
export const getDiscordAvatars = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ ids: z.array(z.string().min(1)).min(1).max(50) }).parse(data),
  )
  .handler(async ({ data }) => {
    const token = process.env["DISCORD_BOT_TOKEN"];
    const result: AvatarMap = {};
    if (!token) return result;

    await Promise.all(
      data.ids.map(async (id) => {
        try {
          const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
            headers: { Authorization: `Bot ${token}` },
          });
          if (!res.ok) return;
          const user = (await res.json()) as {
            avatar?: string | null;
            // "avatar_color" is undocumented; ignore it.
          };
          if (user.avatar) {
            const ext = user.avatar.startsWith("a_") ? "gif" : "png";
            result[id] = `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.${ext}?size=256`;
          }
        } catch {
          /* ignore single-user failures */
        }
      }),
    );

    return result;
  });
