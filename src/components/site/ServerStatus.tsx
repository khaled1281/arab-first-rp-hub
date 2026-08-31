import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Users, Wifi, Moon, Sparkles, Activity } from "lucide-react";
import { getDiscordStatus, type DiscordStatus } from "@/lib/discord-status.functions";
import { useLang, DISCORD_URL } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function ServerStatus() {
  const { t } = useLang();
  const fetchStatus = useServerFn(getDiscordStatus);
  const [status, setStatus] = useState<DiscordStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const data = await fetchStatus();
        if (!cancelled) setStatus(data);
      } catch {
        /* keep placeholder */
      }
    };
    void run();
    const id = setInterval(() => void run(), 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (n?: number) => (status ? (n ?? 0).toLocaleString("en-US") : "—");

  const cards = [
    {
      icon: Users,
      value: fmt(status?.members),
      label: t(["إجمالي الأعضاء", "Total members"]),
      tone: "text-gold",
      ring: "border-gold/30 bg-gold/10",
    },
    {
      icon: Wifi,
      value: fmt(status?.online),
      label: t(["متصل الآن", "Online now"]),
      tone: "text-emerald-400",
      ring: "border-emerald-400/30 bg-emerald-400/10",
    },
    {
      icon: Moon,
      value: fmt(status?.offline),
      label: t(["غير متصل", "Offline"]),
      tone: "text-muted-foreground",
      ring: "border-border bg-surface/60",
    },
    {
      icon: Sparkles,
      value: fmt(status?.boosts),
      label: t(["تعزيزات السيرفر", "Server boosts"]),
      tone: "text-fuchsia-400",
      ring: "border-fuchsia-400/30 bg-fuchsia-400/10",
    },
  ];

  return (
    <Reveal>
      <div className="gold-ring relative overflow-hidden rounded-3xl bg-surface/70 p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {status?.iconUrl ? (
              <img
                src={status.iconUrl}
                alt={status.name}
                className="h-12 w-12 rounded-2xl border border-gold/30 object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                <Activity className="h-5 w-5" />
              </span>
            )}
            <div>
              <p className="font-display text-lg font-extrabold text-gold-gradient">
                {t(["حالة السيرفر", "Server status"])}
              </p>
              <p className="text-xs text-muted-foreground">
                {status?.name ?? "Arab First RP"} · Discord
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold ${
              status?.available
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                : "border-border bg-surface/60 text-muted-foreground"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {status?.available && (
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  status?.available ? "bg-emerald-400" : "bg-muted-foreground"
                }`}
              />
            </span>
            {status?.available
              ? t(["يعمل الآن", "Online"])
              : t(["جاري التحديث", "Updating"])}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="surface-card card-3d rounded-2xl px-4 py-5 text-center"
            >
              <span
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border ${c.ring} ${c.tone}`}
              >
                <c.icon className="h-4 w-4" />
              </span>
              <div className={`mt-3 font-tech text-2xl font-bold tabular-nums ${c.tone}`}>
                {c.value}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {t(["يتم التحديث تلقائياً كل دقيقة", "Auto-refreshes every minute"])}
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gold px-6 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            {t(["دخول الديسكورد", "Open Discord"])}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
