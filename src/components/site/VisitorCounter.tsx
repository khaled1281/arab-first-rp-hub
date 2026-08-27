import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export function VisitorCounter() {
  const { t } = useLang();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const counted = sessionStorage.getItem("af_visit_counted");
      if (!counted) {
        const { data, error } = await supabase.rpc("increment_site_visit");
        sessionStorage.setItem("af_visit_counted", "1");
        if (!cancelled && !error && typeof data === "number") {
          setCount(data);
          return;
        }
      }
      const { data } = await supabase.from("site_stats").select("visits").eq("id", 1).maybeSingle();
      if (!cancelled && data) setCount(Number(data.visits));
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 z-40 ltr:left-4 rtl:right-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-gold/30 bg-background/70 px-4 py-3 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.95)] backdrop-blur-xl">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gold/12 text-gold">
          <Eye className="h-4 w-4" />
          <span className="animate-pulse-ring absolute inset-0 rounded-xl border border-gold/40" />
        </span>
        <div className="leading-tight">
          <div className="font-tech text-base font-bold tabular-nums text-gold-gradient">
            {count === null ? "—" : count.toLocaleString("en-US")}
          </div>
          <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
            {t(["زيارات الموقع", "Site visits"])}
          </div>
        </div>
      </div>
    </div>
  );
}
