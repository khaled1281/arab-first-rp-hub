import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, ArrowRight } from "lucide-react";
import logo from "@/assets/af-logo.png.asset.json";
import { useLang, DISCORD_URL } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { ServerStatus } from "@/components/site/ServerStatus";


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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, dict } = useLang();

  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-20">
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
            <Link
              to="/store"
              className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-7 py-3 text-sm font-bold text-gold transition-colors hover:bg-gold/20"
            >
              <ShoppingBag className="h-4 w-4" />
              {t(dict.nav.store)}
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              {t(dict.hero.cta2)}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
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

      {/* Live Discord server status */}
      <div className="mt-16">
        <ServerStatus />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

        {dict.stats.map((s, idx) => (
          <Reveal key={s.v} delay={idx * 90}>
            <div className="surface-card card-3d rounded-2xl px-5 py-6 text-center">
              <div className="font-display text-2xl font-bold text-gold-gradient">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t(s.l)}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <Link
            to="/departments"
            className="surface-card card-3d flex h-full items-center justify-between gap-4 rounded-2xl p-6 transition-colors hover:border-gold/50"
          >
            <div>
              <p className="font-display text-lg font-bold">{t(dict.departments.t)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t(dict.departments.k)}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gold rtl:rotate-180" />
          </Link>
        </Reveal>
        <Reveal delay={90}>
          <Link
            to="/features"
            className="surface-card card-3d flex h-full items-center justify-between gap-4 rounded-2xl p-6 transition-colors hover:border-gold/50"
          >
            <div>
              <p className="font-display text-lg font-bold">{t(dict.features.t)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t(dict.features.k)}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gold rtl:rotate-180" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
