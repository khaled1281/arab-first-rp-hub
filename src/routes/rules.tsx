import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "القوانين — Arab First RP" },
      {
        name: "description",
        content: "قوانين Arab First RP الأساسية: الاحترام، منع RDM/VDM، الالتزام بالشخصية وعدم استخدام الثغرات.",
      },
      { property: "og:title", content: "Rules — Arab First RP" },
      {
        property: "og:description",
        content: "Core rules of Arab First RP: respect, no RDM/VDM, stay in character, no exploits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  const { t, dict } = useLang();
  return (
    <Section kicker={t(dict.rules.k)} title={t(dict.rules.t)}>
      <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
        {dict.rules.items.map((r, idx) => (
          <Reveal key={r[1]} delay={idx * 60}>
            <div className="surface-card flex items-start gap-3 rounded-xl p-4">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold/15 text-gold">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(r)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
