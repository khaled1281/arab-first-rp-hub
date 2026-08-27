import { createFileRoute } from "@tanstack/react-router";
import {
  Shield,
  Ambulance,
  Flame,
  Users,
  Clock,
  GraduationCap,
  HeartHandshake,
  Trophy,
  TrendingUp,
  Gamepad2,
  Check,
} from "lucide-react";
import logo from "@/assets/af-logo.png.asset.json";
import { useLang, DISCORD_URL } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { BackgroundSlideshow } from "@/components/site/BackgroundSlideshow";
import { SiteNav } from "@/components/site/SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arab First RP — سيرفر الرول بلاي العربي في ERLC" },
      {
        name: "description",
        content:
          "Arab First RP: أول سيرفر رول بلاي عربي احترافي داخل ERLC روبلوكس. شرطة، إسعاف، إطفاء ومدنيون، إدارة نشطة وفعاليات أسبوعية.",
      },
      { property: "og:title", content: "Arab First RP — Arabic ERLC Roleplay Server" },
      {
        property: "og:description",
        content:
          "The premier Arabic roleplay experience inside ERLC Roblox. Police, EMS, Fire and Civilians. Est. 2025.",
      },
    ],
  }),
  component: Index,
});

const featureIcons = [Gamepad2, Clock, GraduationCap, HeartHandshake, Trophy, TrendingUp];
const deptIcons = [Shield, Ambulance, Flame, Users];

function Index() {
  const { lang, setLang, t, dict } = useLang();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundSlideshow />
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="glow-orb left-[-10%] top-[-8%] h-[420px] w-[420px] bg-gold" aria-hidden="true" />
      <div className="glow-orb right-[-12%] top-[35%] h-[380px] w-[380px] bg-gold-deep" aria-hidden="true" />

      <SiteNav />

      {/* Hero */}
      <section id="top" className="relative mx-auto max-w-6xl px-5 pb-24 pt-16 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-rise text-center md:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-surface/60 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-gold">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-gold" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {t(dict.hero.badge)}
            </span>

            <h1 className="mt-6 leading-[0.95]">
              <span className="shine-text block font-brand text-6xl tracking-[0.02em] sm:text-7xl lg:text-8xl">
                ARAB FIRST
              </span>
              <span className="text-metal-gradient block font-brand text-5xl tracking-[0.35em] sm:text-6xl">
                RP
              </span>
              <span className="text-erlc-gradient mt-3 block font-tech text-lg font-black tracking-[0.5em] sm:text-xl">
                ERLC
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:mx-0">
              {t(dict.hero.sub)}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="gold-ring rounded-full bg-gold px-7 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                {t(dict.hero.cta)}
              </a>
              <a
                href="#about"
                className="rounded-full border border-border bg-surface/60 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {t(dict.hero.cta2)}
              </a>
            </div>
          </div>

          {/* 3D logo */}
          <div className="scene-3d flex justify-center">
            <div className="animate-float relative">
              <div className="glow-orb inset-0 h-full w-full bg-gold opacity-50" aria-hidden="true" />
              <img
                src={logo.url}
                alt="Arab First RP 3D logo"
                className="animate-spin3d relative h-56 w-56 object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)] sm:h-72 sm:w-72"
                style={{ transformStyle: "preserve-3d" }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {dict.stats.map((s, idx) => (
            <Reveal key={s.v} delay={idx * 90}>
              <div className="surface-card card-3d rounded-2xl px-5 py-6 text-center">
                <div className="font-display text-2xl font-bold text-gold-gradient">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t(s.l)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About */}
      <Section id="about" kicker={t(dict.about.k)} title={t(dict.about.t)}>
        <Reveal>
          <div className="surface-card mx-auto max-w-3xl rounded-3xl p-8 text-center">
            <p className="text-base leading-loose text-muted-foreground">{t(dict.about.p)}</p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <p className="mt-5 font-display text-xs tracking-[0.3em] text-gold">
              EST. 2025 · DEVELOPED BY N16Q
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Features */}
      <Section id="features" kicker={t(dict.features.k)} title={t(dict.features.t)}>
        <div className="scene-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dict.features.items.map((f, idx) => {
            const Icon = featureIcons[idx]!;
            return (
              <Reveal key={f.t[1]} delay={idx * 70}>
                <div className="surface-card card-3d h-full rounded-2xl p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/12 text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t(f.t)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(f.d)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Departments */}
      <Section id="departments" kicker={t(dict.departments.k)} title={t(dict.departments.t)}>
        <div className="scene-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.departments.items.map((d, idx) => {
            const Icon = deptIcons[idx]!;
            return (
              <Reveal key={d.t[1]} delay={idx * 80}>
                <div className="surface-card card-3d group relative h-full overflow-hidden rounded-2xl p-6">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition-opacity group-hover:opacity-100" />
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-4 font-display text-lg font-bold">{t(d.t)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(d.d)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Rules */}
      <Section id="rules" kicker={t(dict.rules.k)} title={t(dict.rules.t)}>
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {dict.rules.items.map((r, idx) => (
            <Reveal key={r[1]} delay={idx * 60}>
              <div className="surface-card flex items-start gap-3 rounded-xl p-4">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold/15 text-gold">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(r)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Join */}
      <section className="relative mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="gold-ring relative overflow-hidden rounded-3xl bg-surface/70 px-6 py-16 text-center backdrop-blur-xl">
            <div className="glow-orb left-1/2 top-0 h-64 w-64 -translate-x-1/2 bg-gold" aria-hidden="true" />
            <img
              src={logo.url}
              alt=""
              aria-hidden="true"
              className="animate-float mx-auto h-20 w-20 object-contain"
            />
            <p className="mt-6 font-display text-xs tracking-[0.35em] text-gold">
              {t(dict.join.k).toUpperCase()}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              <span className="shine-text">{t(dict.join.t)}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t(dict.join.p)}
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              {t(dict.join.cta)}
            </a>
            <p className="mt-4 text-xs text-muted-foreground">discord.gg/af-1</p>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
          <img src={logo.url} alt="Arab First RP" className="h-10 w-10 object-contain" />
          <p className="font-brand text-lg tracking-[0.18em] text-gold-gradient">
            ARAB FIRST <span className="font-tech text-sm text-erlc">RP</span>
          </p>
          <p className="text-xs text-muted-foreground">
            EST. 2025 · {t(dict.footer.dev)} : n16q
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Arab First RP — {t(dict.footer.rights)}
          </p>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <Reveal className="mb-12 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-gold">{kicker.toUpperCase()}</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{title}</h2>
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </Reveal>
      {children}
    </section>
  );
}
