import { Outlet, useRouterState, Link } from "@tanstack/react-router";
import logo from "@/assets/af-logo.png.asset.json";
import { useLang, DISCORD_URL } from "@/lib/i18n";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { SiteNav } from "./SiteNav";
import { VisitorCounter } from "./VisitorCounter";
import { SwipeNav } from "./SwipeNav";

export function SiteLayout() {
  const { t, dict } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <BackgroundSlideshow />
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="glow-orb left-[-10%] top-[-8%] h-[420px] w-[420px] bg-gold" aria-hidden="true" />
      <div className="glow-orb right-[-12%] top-[35%] h-[380px] w-[380px] bg-gold-deep" aria-hidden="true" />

      <SiteNav />
      <VisitorCounter />

      <main key={pathname} className="animate-rise flex-1">
        <Outlet />
      </main>

      {!isHome && (
        <section className="relative mx-auto w-full max-w-6xl px-5 pb-8">
          <div className="gold-ring relative overflow-hidden rounded-3xl bg-surface/70 px-6 py-10 text-center backdrop-blur-xl">
            <h2 className="font-display text-2xl font-extrabold">
              <span className="shine-text">{t(dict.join.t)}</span>
            </h2>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block rounded-full bg-gold px-7 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              {t(dict.join.cta)}
            </a>
          </div>
        </section>
      )}

      <SwipeNav />

      <footer className="relative border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
          <Link to="/">
            <img src={logo.url} alt="Arab First RP" className="h-10 w-10 object-contain" />
          </Link>
          <p className="font-brand text-lg tracking-[0.18em] text-gold-gradient">
            ARAB FIRST <span className="font-tech text-sm text-erlc">RP</span>
          </p>
          <p className="text-xs text-muted-foreground">EST. 2025 · {t(dict.footer.dev)} : n16q</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Arab First RP — {t(dict.footer.rights)}
          </p>
        </div>
      </footer>
    </div>
  );
}
