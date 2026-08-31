import { createServerFn } from "@tanstack/react-start";

const GUILD_ID = "1183042468854382612";

export type DiscordStatus = {
  name: string;
  iconUrl: string | null;
  members: number;
  online: number;
  offline: number;
  boosts: number;
  available: boolean;
};

/**
 * Live Discord server stats (members / online / offline / boosts).
 * Reads DISCORD_BOT_TOKEN inside the handler.
 */
export const getDiscordStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<DiscordStatus> => {
    const empty: DiscordStatus = {
      name: "Arab First RP",
      iconUrl: null,
      members: 0,
      online: 0,
      offline: 0,
      boosts: 0,
      available: false,
    };

    const token = process.env["DISCORD_BOT_TOKEN"];
    if (!token) return empty;

    try {
      const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`,
        { headers: { Authorization: `Bot ${token}` } },
      );
      if (!res.ok) return empty;
      const g = (await res.json()) as {
        name: string;
        icon?: string | null;
        approximate_member_count?: number;
        approximate_presence_count?: number;
        premium_subscription_count?: number;
      };

      const members = g.approximate_member_count ?? 0;
      const online = g.approximate_presence_count ?? 0;

      return {
        name: g.name,
        iconUrl: g.icon
          ? `https://cdn.discordapp.com/icons/${GUILD_ID}/${g.icon}.${g.icon.startsWith("a_") ? "gif" : "png"}?size=128`
          : null,
        members,
        online,
        offline: Math.max(members - online, 0),
        boosts: g.premium_subscription_count ?? 0,
        available: true,
      };
    } catch {
      return empty;
    }
  },
);
