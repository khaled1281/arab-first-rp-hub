export type RobloxProfile = {
  id: string;
  username: string;
  displayName: string;
  createdAt: string | null;
  avatarUrl: string | null;
};

/** Look up a Roblox account by username: id, creation date and full-body avatar. */
export async function getRobloxProfile(username: string): Promise<RobloxProfile | null> {
  const name = username.trim().replace(/^@/, "");
  if (!name) return null;

  try {
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [name], excludeBannedUsers: false }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      data?: Array<{ id: number; name: string; displayName?: string }>;
    };
    const hit = body.data?.[0];
    if (!hit) return null;

    const id = String(hit.id);
    let createdAt: string | null = null;
    try {
      const detail = await fetch(`https://users.roblox.com/v1/users/${id}`);
      if (detail.ok) {
        const d = (await detail.json()) as { created?: string };
        createdAt = d.created ? new Date(d.created).toISOString() : null;
      }
    } catch {
      /* ignore */
    }

    let avatarUrl: string | null = null;
    try {
      const thumb = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=420x420&format=Png&isCircular=false`,
      );
      if (thumb.ok) {
        const t = (await thumb.json()) as { data?: Array<{ imageUrl?: string }> };
        avatarUrl = t.data?.[0]?.imageUrl ?? null;
      }
    } catch {
      /* ignore */
    }

    return {
      id,
      username: hit.name,
      displayName: hit.displayName ?? hit.name,
      createdAt,
      avatarUrl,
    };
  } catch {
    return null;
  }
}
