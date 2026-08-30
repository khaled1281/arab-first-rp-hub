import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Shield, Star, HeartHandshake, Code2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getDiscordAvatars } from "@/lib/discord-avatars.functions";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "فريق العمل — Arab First RP" },
      {
        name: "description",
        content: "تعرّف على فريق إدارة Arab First RP: الأونر، الكو أونر، المستشارين، الإدارة العليا، ومبرمج السيرفر.",
      },
      { property: "og:title", content: "Team — Arab First RP" },
      {
        property: "og:description",
        content: "Meet the Arab First RP leadership: owner, co-owner, advisors, senior staff and the official server developer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

type Member = {
  name: string;
  role: readonly [string, string];
  icon: typeof Crown;
  /** Discord user ID — enables the real Discord avatar. */
  id?: string;
  /** Discord avatar hash (optional, from the Discord API). */
  hash?: string;
};

/** Real Discord avatar when we know the user ID, otherwise null. */
function discordAvatar(m: Member, override?: string | null, size = 256) {
  if (override) return override;
  if (!m.id) return null;
  if (m.hash) {
    const ext = m.hash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${m.id}/${m.hash}.${ext}?size=${size}`;
  }
  // Default Discord avatar derived from the user ID (new username system).
  const idx = Number((BigInt(m.id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
}

const OWNER: Member = { name: "5tt7", role: ["الأونر", "Owner"], icon: Crown, id: "514688117748269059" };
const CO_OWNER: Member = { name: "l5f_", role: ["الكو أونر", "Co-Owner"], icon: Shield, id: "795165795495706654" };
const ADVISORS: Member[] = [
  { name: "t7i7", role: ["مستشار الأونر", "Owner Advisor"], icon: Star, id: "1159878365902295142" },
  { name: "f_77j", role: ["مستشار الأونر الثاني", "Second Owner Advisor"], icon: Star, id: "356995775185813514" },
];
const ASSISTANT: Member = { name: "4s7b", role: ["مساعدة الأونر", "Owner Assistant"], icon: HeartHandshake, id: "525688320542638091" };
const STAFF_ADVISOR: Member = {
  name: "do.a1",
  role: ["مستشار مسؤول الإدارة", "Staff Manager Advisor"],
  icon: Star,
  id: "1291851466612674655",
};
const SENIOR: Member[] = [
  { name: "bf7v", role: ["إدارة عليا", "Senior Staff"], icon: Shield, id: "441691499776704513" },
  { name: "n16q", role: ["إدارة عليا", "Senior Staff"], icon: Shield, id: "1327699415372398696" },
];
const SENIOR_ASSISTANT: Member = {
  name: "76t2",
  role: ["مساعد الإدارة العليا", "Senior Staff Assistant"],
  icon: HeartHandshake,
  id: "521398718277091340",
};

/** Vertical gold connector line between hierarchy levels. */
function Link({ height = 40 }: { height?: number }) {
  return (
    <div className="relative mx-auto w-px" style={{ height }} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[var(--shadow-gold)]" />
    </div>
  );
}

/** Branch that splits into two children. */
function Branch() {
  return (
    <div className="relative mx-auto hidden h-10 w-full sm:block" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gold/60" />
      <div className="absolute left-1/4 right-1/4 top-4 h-px bg-gradient-to-r from-gold/20 via-gold/60 to-gold/20" />
      <div className="absolute left-1/4 top-4 h-6 w-px bg-gold/60" />
      <div className="absolute right-1/4 top-4 h-6 w-px bg-gold/60" />
    </div>
  );
}


function Avatar({
  member,
  size = "md",
  avatarUrl,
}: {
  member: Member;
  size?: "lg" | "md" | "sm";
  avatarUrl?: string | null | undefined;
}) {
  const dim = size === "lg" ? "h-28 w-28 text-4xl" : size === "md" ? "h-20 w-20 text-2xl" : "h-16 w-16 text-xl";
  const src = discordAvatar(member, avatarUrl);
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative shrink-0" style={{ transform: "translateZ(45px)" }}>
      <div className="absolute inset-0 rounded-full bg-gold/25 blur-xl transition-all duration-500 group-hover/tilt:bg-gold/45 group-hover/tilt:blur-2xl" aria-hidden="true" />
      <div
        className={`relative ${dim} grid place-items-center overflow-hidden rounded-full border border-gold/45 bg-surface-2/80 font-tech font-black text-gold-gradient shadow-[var(--shadow-gold)] transition-transform duration-500 group-hover/tilt:scale-105`}
      >
        {src && !broken ? (
          <img
            src={src}
            alt={`@${member.name}`}
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          member.name.slice(0, 2).toUpperCase()
        )}
      </div>
    </div>
  );
}

function Card({ m, featured = false, avatarUrl }: { m: Member; featured?: boolean; avatarUrl?: string | null }) {
  const Icon = m.icon;
  const { t } = useLang();
  return (
    <TiltCard
      className={`surface-card flex h-full flex-col items-center gap-3 overflow-hidden rounded-3xl p-6 text-center hover:shadow-[var(--shadow-gold)] ${
        featured ? "gold-ring" : ""
      }`}
    >
      <Avatar member={m} size={featured ? "lg" : "md"} avatarUrl={avatarUrl} />
      <div className="flex items-center gap-1.5 text-gold" style={{ transform: "translateZ(28px)" }}>
        <Icon className="h-3.5 w-3.5 transition-transform duration-500 group-hover/tilt:rotate-12" />
        <span className="font-display text-[0.65rem] tracking-[0.28em]">{t(m.role).toUpperCase()}</span>
      </div>
      <p
        className={`font-tech font-black ${featured ? "text-2xl" : "text-lg"} text-foreground transition-colors duration-300 group-hover/tilt:text-gold-gradient`}
        style={{ transform: "translateZ(20px)" }}
      >
        @{m.name}
      </p>
    </TiltCard>
  );
}

function useDiscordAvatars(members: { id?: string }[]) {
  const fetchAvatars = useServerFn(getDiscordAvatars);
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    const ids = members.map((m) => m.id).filter((x): x is string => Boolean(x));
    if (ids.length === 0) return;
    let alive = true;
    fetchAvatars({ data: { ids } })
      .then((res) => {
        if (alive && res) setMap(res);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return map;
}

function TeamPage() {
  const { lang, t, dict } = useLang();
  const ar = lang === "ar";

  return (
    <Section kicker={t(dict.team.k)} title={t(dict.team.t)}>
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-md">
          <Card m={OWNER} featured />
        </Reveal>

        <Link />

        <Reveal delay={80} className="mx-auto max-w-sm">
          <Card m={CO_OWNER} />
        </Reveal>

        <Branch />
        <div className="sm:hidden"><Link /></div>

        <div className="grid gap-6 sm:grid-cols-2">
          {ADVISORS.map((m, i) => (
            <Reveal key={m.name} delay={120 + i * 80}>
              <Card m={m} />
            </Reveal>
          ))}
        </div>

        <Link />

        <Reveal delay={240} className="mx-auto max-w-sm">
          <Card m={ASSISTANT} />
        </Reveal>

        <Link />

        <Reveal delay={280} className="mx-auto max-w-sm">
          <Card m={STAFF_ADVISOR} />
        </Reveal>

        <Branch />
        <div className="sm:hidden"><Link /></div>

        <div className="grid gap-6 sm:grid-cols-2">
          {SENIOR.map((m, i) => (
            <Reveal key={m.name} delay={300 + i * 80}>
              <Card m={m} />
            </Reveal>
          ))}
        </div>

        <Link />

        <Reveal delay={380} className="mx-auto max-w-sm">
          <Card m={SENIOR_ASSISTANT} />
        </Reveal>

        <Link height={56} />


        {/* Official developer — special card */}
        <Reveal delay={420}>
          <TiltCard intensity={7} className="gold-ring relative overflow-hidden rounded-3xl bg-surface/70 p-8 backdrop-blur-xl">
            <div className="glow-orb -top-16 left-1/2 h-56 w-56 -translate-x-1/2 bg-gold" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:text-start">
              <div className="animate-float">
                <Avatar member={{ name: "n16q", role: ["", ""], icon: Code2 }} size="lg" />
              </div>
              <div className={`flex-1 text-center ${ar ? "sm:text-right" : "sm:text-left"}`}>
                <div className="flex items-center justify-center gap-2 text-erlc sm:justify-start">
                  <Code2 className="h-4 w-4" />
                  <span className="font-tech text-[0.65rem] tracking-[0.3em]">
                    {t(dict.team.devRole).toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 font-brand text-4xl tracking-[0.12em] text-gold-gradient">N16Q</p>
                <p className="mt-3 text-sm leading-loose text-muted-foreground">{t(dict.team.devDesc)}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {["Website", "Systems", "Bots", "Design"].map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 font-tech text-[0.65rem] tracking-widest text-gold"
                    >
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        <p className="pt-2 text-center text-xs text-muted-foreground">{t(dict.team.note)}</p>
      </div>
    </Section>
  );
}
