import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Building2, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { TiltCard } from "@/components/site/TiltCard";
import serverMap from "@/assets/server-map.png.asset.json";

export const Route = createFileRoute("/safezones")({
  head: () => ({
    meta: [
      { title: "المناطق الآمنة — Arab First RP" },
      {
        name: "description",
        content:
          "خريطة السيرفر الرسمية لـ Arab First RP Season 4 داخل ERLC. المناطق الآمنة والمناطق التجارية والطرق الرئيسية.",
      },
      { property: "og:title", content: "Safe Zones — Arab First RP" },
      {
        property: "og:description",
        content:
          "The official Season 4 server map of Arab First RP inside ERLC — safe zones, commercial districts and main roads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafeZonesPage,
});

const LEGEND = [
  { Icon: ShieldCheck, color: "text-[#48a96b]", dot: "bg-[#48a96b]" },
  { Icon: Building2, color: "text-[#d98d3e]", dot: "bg-[#d98d3e]" },
  { Icon: RouteIcon, color: "text-muted-foreground", dot: "bg-[#4d4d4d]" },
] as const;

function SafeZonesPage() {
  const { t, dict } = useLang();
  const sz = dict.safezones;

  return (
    <Section kicker={t(sz.k)} title={t(sz.t)}>
      <Reveal className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">{t(sz.p)}</p>
      </Reveal>

      {/* Map */}
      <Reveal>
        <TiltCard className="overflow-hidden rounded-2xl">
          <div className="surface-card relative overflow-hidden rounded-2xl p-2 sm:p-3">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-erlc/10 blur-3xl" />
            <img
              src={serverMap.url}
              alt={t(sz.t)}
              className="relative z-10 w-full rounded-xl object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
              loading="lazy"
            />
          </div>
        </TiltCard>
      </Reveal>

      {/* Legend */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {LEGEND.map((item, idx) => {
          const label = idx === 0 ? sz.safe : idx === 1 ? sz.commercial : sz.road;
          return (
            <Reveal key={idx} delay={idx * 90}>
              <TiltCard className="h-full">
                <div className="surface-card flex h-full items-center gap-3 rounded-2xl p-5">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2/70 ${item.color}`}>
                    <item.Icon className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                    <span className="text-sm font-semibold">{t(label)}</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      {/* Note */}
      <Reveal className="mt-8">
        <div className="flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-5">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm leading-relaxed text-muted-foreground">{t(sz.note)}</p>
        </div>
      </Reveal>
    </Section>
  );
}
