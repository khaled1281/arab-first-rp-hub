import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  ArrowLeftRight,
  Home,
  Info,
  Sparkles,
  Shield,
  ScrollText,
  ShoppingBag,
  Users,
  ShieldCheck,
  Eye,
  Code2,
} from "lucide-react";
import logo from "@/assets/af-logo.png.asset.json";
import { useLang, DISCORD_URL } from "@/lib/i18n";
import { NAV_ORDER, NAV_KEYS, type NavPath } from "@/lib/site-nav";

const ICONS: Record<NavPath, typeof Home> = {
  "/": Home,
  "/about": Info,
  "/team": Users,
  "/staff": ShieldCheck,
  "/supervision": Eye,
  "/features": Sparkles,
  "/departments": Shield,
  "/rules": ScrollText,
  "/store": ShoppingBag,
};

export function SiteNav() {
  const { lang, setLang, t, dict } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (p: NavPath) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/20 bg-background/85 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          : "border-b border-transparent bg-background/35 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 lg:grid-cols-[1fr_auto_1fr]">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <img
            src={logo.url}
            alt="Arab First RP"
            className="h-9 w-9 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110"
          />
          <span className="truncate font-brand text-base tracking-[0.16em] text-gold-gradient">
            ARAB FIRST <span className="font-tech text-xs text-erlc">RP</span>
          </span>
        </Link>

        {/* Desktop pill menu */}
        <div className="col-start-2 hidden items-center gap-1 justify-self-center rounded-full border border-border/70 bg-surface/50 p-1 backdrop-blur-xl lg:flex">
          {NAV_ORDER.map((p) => {
            const Icon = ICONS[p];
            const active = isActive(p);
            return (
              <Link
                key={p}
                to={p}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--gold)_38%,transparent)]"
                    : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(dict.nav[NAV_KEYS[p]])}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold text-foreground transition-colors hover:border-gold hover:text-gold"
            aria-label="Switch language"
          >
            <span className="text-sm leading-none" aria-hidden="true">
              {lang === "ar" ? "🇬🇧" : "🇸🇦"}
            </span>
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {lang === "ar" ? "EN" : "ع"}
          </button>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-gold px-5 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-105 sm:inline-block"
          >
            {t(dict.nav.join)}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1.5 px-5 py-4">
          {NAV_ORDER.map((p, i) => {
            const Icon = ICONS[p];
            const active = isActive(p);
            return (
              <Link
                key={p}
                to={p}
                style={{
                  transitionDelay: open ? `${i * 55}ms` : "0ms",
                  transform: open ? "translateY(0)" : "translateY(-10px)",
                  opacity: open ? 1 : 0,
                }}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "border-gold/45 bg-gold/10 text-gold"
                    : "border-border/50 bg-surface/40 text-foreground hover:border-gold/40 hover:text-gold"
                }`}
              >
                <Icon className="h-4 w-4 text-gold" />
                {t(dict.nav[NAV_KEYS[p]])}
              </Link>
            );
          })}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-1 rounded-xl bg-gold px-4 py-3 text-center text-sm font-bold text-primary-foreground"
          >
            {t(dict.nav.join)}
          </a>
        </div>
      </div>
    </header>
  );
}
