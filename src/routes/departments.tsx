import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Ambulance, Flame, Users, Lock } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";


export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "الأقسام — Arab First RP" },
      {
        name: "description",
        content: "أقسام Arab First RP داخل ERLC: الشرطة، الإسعاف، الإطفاء والمدنيون. اختر مسارك وابدأ.",
      },
      { property: "og:title", content: "Departments — Arab First RP" },
      {
        property: "og:description",
        content: "Police, EMS, Fire and Civilians — choose your path inside Arab First RP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DepartmentsPage,
});

const icons = [Shield, Ambulance, Flame, Users];

function DepartmentsPage() {
  const { t, dict } = useLang();
  return (
    <Section kicker={t(dict.departments.k)} title={t(dict.departments.t)}>
      <div className="scene-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dict.departments.items.map((d, idx) => {
          const Icon = icons[idx]!;
          return (
            <Reveal key={d.t[1]} delay={idx * 80}>
              <div className="surface-card card-3d group relative h-full overflow-hidden rounded-2xl p-6">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
                <Icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-display text-lg font-bold">{t(d.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(d.d)}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
