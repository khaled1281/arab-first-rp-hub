import { createFileRoute } from "@tanstack/react-router";
import { Clock, GraduationCap, HeartHandshake, Trophy, TrendingUp, Gamepad2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "المميزات — Arab First RP" },
      {
        name: "description",
        content: "مميزات سيرفر Arab First RP: رول بلاي واقعي، إدارة نشطة 24/7، تدريب، فعاليات وترقيات عادلة.",
      },
      { property: "og:title", content: "Features — Arab First RP" },
      {
        property: "og:description",
        content: "Realistic roleplay, 24/7 active staff, training, events and fair promotions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeaturesPage,
});

const icons = [Gamepad2, Clock, GraduationCap, HeartHandshake, Trophy, TrendingUp];

function FeaturesPage() {
  const { t, dict } = useLang();
  return (
    <Section kicker={t(dict.features.k)} title={t(dict.features.t)}>
      <div className="scene-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dict.features.items.map((f, idx) => {
          const Icon = icons[idx]!;
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
  );
}
