import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Ambulance, Flame, Users, Lock, Scale } from "lucide-react";
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

const icons = [Shield, Ambulance, Flame, Users, Scale];

function DepartmentsPage() {
  const { t, dict } = useLang();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const dep = dict.departments;

  return (
    <Section kicker={t(dep.k)} title={t(dep.t)}>
      <div className="scene-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dep.items.map((d, idx) => {
          const Icon = icons[idx]!;
          const canApply = idx !== 3;
          const isOpen = openIdx === idx;
          return (
            <Reveal key={d.t[1]} delay={idx * 80}>
              <div className="surface-card card-3d group relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
                <Icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-display text-lg font-bold">{t(d.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(d.d)}</p>

                <div className="mt-5 flex-1" />

                {canApply ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:shadow-[0_0_24px_-6px_hsl(var(--gold)/0.6)] active:scale-[0.98]"
                    >
                      <Lock className="h-4 w-4" />
                      {t(dep.apply)}
                    </button>

                    <div
                      className={`grid transition-all duration-500 ease-out ${
                        isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                          <p className="text-xs font-bold text-destructive">{t(dep.closedTitle)}</p>
                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                            {t(dep.closedMsg)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground/70">
                      {t(dep.status)}
                    </p>
                  </>
                ) : (
                  <p className="rounded-xl border border-border/60 bg-background/30 px-4 py-2.5 text-center text-xs text-muted-foreground">
                    {t(dep.noApply)}
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );

}
