import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Code2, Award, Timer, Braces } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getDiscordAvatars } from "@/lib/discord-avatars.functions";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { TiltCard } from "@/components/site/TiltCard";

export const Route = createFileRoute("/dev-team")({
  head: () => ({
    meta: [
      { title: "الطاقم البرمجي — Arab First RP" },
      {
        name: "description",
        content:
          "الطاقم البرمجي في Arab First RP: n16q، مسؤول البرمجة، 13 شهادة برمجية دولية و7 سنوات خبرة في أكثر من 11 لغة برمجية.",
      },
      { property: "og:title", content: "Dev Team — Arab First RP" },
      {
        property: "og:description",
        content: "n16q — head of development at Arab First RP: 13 international certifications, 7 years of experience, 11+ languages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DevTeamPage,
});

const DEV_ID = "1327699415372398696";
const LANGS: { name: string; emoji: string }[] = [
  { name: "Java", emoji: "☕" },
  { name: "Python", emoji: "🐍" },
  { name: "JavaScript", emoji: "🟨" },
  { name: "HTML", emoji: "🌐" },
  { name: "CSS", emoji: "🎨" },
  { name: "Lua", emoji: "🌙" },
  { name: "Go", emoji: "🐹" },
  { name: "C+", emoji: "🔧" },
  { name: "C", emoji: "⚙️" },
  { name: "C++", emoji: "⚡" },
  { name: "Rust", emoji: "🦀" },
];

function DevTeamPage() {
  const { lang, t, dict } = useLang();
  const ar = lang === "ar";
  const d = dict.devTeam;
  const fetchAvatars = useServerFn(getDiscordAvatars);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAvatars({ data: { ids: [DEV_ID] } })
      .then((res) => {
        if (alive && res?.[DEV_ID]) setAvatar(res[DEV_ID]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    { icon: Award, v: "13", l: d.certs },
    { icon: Timer, v: "7", l: d.years },
    { icon: Braces, v: "11+", l: d.langs },
  ];

  return (
    <Section kicker={t(d.k)} title={t(d.t)}>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-loose text-muted-foreground">{t(d.p)}</p>

      <div className="mx-auto max-w-3xl">
        <Reveal>
          <TiltCard intensity={7} className="gold-ring relative overflow-hidden rounded-3xl bg-surface/70 p-8 backdrop-blur-xl">
            <div className="glow-orb -top-16 left-1/2 h-56 w-56 -translate-x-1/2 bg-gold" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              <div className="animate-float relative shrink-0" style={{ transform: "translateZ(45px)" }}>
                <div className="absolute inset-0 rounded-full bg-gold/25 blur-xl" aria-hidden="true" />
                <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border border-gold/45 bg-surface-2/80 font-tech text-4xl font-black text-gold-gradient shadow-[var(--shadow-gold)]">
                  {avatar ? (
                    <img src={avatar} alt="@n16q" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    "N1"
                  )}
                </div>
              </div>

              <div className={`flex-1 text-center ${ar ? "sm:text-right" : "sm:text-left"}`}>
                <div className="flex items-center justify-center gap-2 text-erlc sm:justify-start">
                  <Code2 className="h-4 w-4" />
                  <span className="font-tech text-[0.65rem] tracking-[0.3em]">{t(d.role).toUpperCase()}</span>
                </div>
                <p className="mt-2 font-brand text-4xl tracking-[0.12em] text-gold-gradient">N16Q</p>
                <p className="mt-3 text-sm leading-loose text-muted-foreground">{t(dict.team.devDesc)}</p>
              </div>
            </div>

            <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-gold/25 bg-background/40 p-5 text-center transition-colors duration-300 hover:border-gold/50"
                  >
                    <Icon className="mx-auto h-5 w-5 text-gold" />
                    <p className="mt-2 font-tech text-3xl font-black text-gold-gradient">{s.v}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{t(s.l)}</p>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-8">
              <p className="text-center font-display text-xs tracking-[0.3em] text-gold">
                {t(d.langsTitle).toUpperCase()}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {LANGS.map((l) => (
                  <span
                    key={l.name}
                    className="flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1.5 font-tech text-[0.7rem] tracking-widest text-gold transition-transform duration-300 hover:scale-110"
                  >
                    <span className="text-[0.85rem] leading-none">{l.emoji}</span>
                    {l.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </Section>
  );
}
