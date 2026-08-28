import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_ORDER, NAV_KEYS, type NavPath } from "@/lib/site-nav";
import { useLang } from "@/lib/i18n";

/** Mobile-only: swipe left/right to move between pages, plus prev/next buttons. */
export function SwipeNav() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, dict, lang } = useLang();
  const start = useRef<{ x: number; y: number } | null>(null);
  const [hint, setHint] = useState<"prev" | "next" | null>(null);

  const index = NAV_ORDER.findIndex((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p),
  );
  const prev = index > 0 ? (NAV_ORDER[index - 1] as NavPath) : null;
  const next = index >= 0 && index < NAV_ORDER.length - 1 ? (NAV_ORDER[index + 1] as NavPath) : null;

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      start.current = { x: touch.clientX, y: touch.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      const s = start.current;
      const touch = e.changedTouches[0];
      start.current = null;
      if (!s || !touch) return;
      const dx = touch.clientX - s.x;
      const dy = touch.clientY - s.y;
      if (Math.abs(dx) < 70 || Math.abs(dy) > 60) return;
      // Swipe left = forward in LTR, backward in RTL
      const forward = lang === "ar" ? dx > 0 : dx < 0;
      const target = forward ? next : prev;
      if (target) {
        setHint(forward ? "next" : "prev");
        window.setTimeout(() => setHint(null), 400);
        void navigate({ to: target });
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [lang, next, prev, navigate]);

  return (
    <div className="lg:hidden">
      <div
        className={`pointer-events-none fixed inset-0 z-40 bg-gold/5 transition-opacity duration-300 ${
          hint ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 pb-24 pt-4">
        <button
          disabled={!prev}
          onClick={() => prev && navigate({ to: prev })}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border/60 bg-surface/50 px-4 py-3 text-xs font-bold text-foreground backdrop-blur-xl transition-colors disabled:opacity-30 enabled:hover:border-gold enabled:hover:text-gold"
        >
          <ChevronRight className="h-4 w-4 ltr:hidden" />
          <ChevronLeft className="h-4 w-4 rtl:hidden" />
          {prev ? t(dict.nav[NAV_KEYS[prev]]) : "—"}
        </button>
        <button
          disabled={!next}
          onClick={() => next && navigate({ to: next })}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gold/35 bg-gold/10 px-4 py-3 text-xs font-bold text-gold backdrop-blur-xl transition-colors disabled:opacity-30 enabled:hover:bg-gold/20"
        >
          {next ? t(dict.nav[NAV_KEYS[next]]) : "—"}
          <ChevronLeft className="h-4 w-4 ltr:hidden" />
          <ChevronRight className="h-4 w-4 rtl:hidden" />
        </button>
      </div>
      <p className="pointer-events-none -mt-20 pb-2 text-center text-[10px] text-muted-foreground">
        {t(["اسحب يميناً أو يساراً للتنقل", "Swipe left or right to navigate"])}
      </p>
    </div>
  );
}
