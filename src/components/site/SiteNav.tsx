import { useEffect, useState } from "react";
import { Menu, X, ArrowLeftRight, Info, Sparkles, Shield, ScrollText } from "lucide-react";
import logo from "@/assets/af-logo.png.asset.json";
import { useLang, DISCORD_URL } from "@/lib/i18n";

const SECTIONS = ["about", "features", "departments", "rules"] as const;
const ICONS = [Info, Sparkles, Shield, ScrollText];

export function SiteNav() {
  const { lang, setLang, t, dict } = useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = ["top", ...SECTIONS]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/20 bg-background/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          : "border-b border-transparent bg-background/30 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <a href="#top" className="group flex items-center gap-2.5">
          <img
            src={logo.url}
            alt="Arab First RP"
            className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110"
          />
          <span className="font-brand text-base tracking-[0.16em] text-gold-gradient">
            ARAB FIRST <span className="font-tech text-xs text-erlc">RP</span>
          </span>
        </a>

        {/* Desktop pill menu */}
        <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-surface/50 p-1 backdrop-blur-xl md:flex">
          {SECTIONS.map((k, i) => {
            const Icon = ICONS[i]!;
            const isActive = active === k;
            return (
              <a
                key={k}
                href={`#${k}`}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--gold)_35%,transparent)]"
                    : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(dict.nav[k])}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold text-foreground transition-colors hover:border-gold hover:text-gold"
            aria-label="Switch language"
          >
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold md:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl transition-[max-height,opacity] duration-400 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1.5 px-5 py-4">
          {SECTIONS.map((k, i) => {
            const Icon = ICONS[i]!;
            return (
              <a
                key={k}
                href={`#${k}`}
                onClick={() => setOpen(false)}
                style={{
                  transitionDelay: open ? `${i * 60}ms` : "0ms",
                  transform: open ? "translateY(0)" : "translateY(-8px)",
                  opacity: open ? 1 : 0,
                }}
                className={`flex items-center gap-3 rounded-xl border border-border/50 px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  active === k
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "bg-surface/40 text-foreground hover:border-gold/40 hover:text-gold"
                }`}
              >
                <Icon className="h-4 w-4 text-gold" />
                {t(dict.nav[k])}
              </a>
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
