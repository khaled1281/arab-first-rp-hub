import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن السيرفر — Arab First RP" },
      {
        name: "description",
        content: "تعرف على Arab First RP، أول سيرفر رول بلاي عربي احترافي داخل ERLC روبلوكس منذ 2025.",
      },
      { property: "og:title", content: "About — Arab First RP" },
      {
        property: "og:description",
        content: "Learn about Arab First RP, the premier Arabic ERLC roleplay community since 2025.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, dict } = useLang();
  return (
    <Section kicker={t(dict.about.k)} title={t(dict.about.t)}>
      <Reveal>
        <div className="surface-card mx-auto max-w-3xl rounded-3xl p-8 text-center">
          <p className="text-base leading-loose text-muted-foreground">{t(dict.about.p)}</p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="mt-5 font-display text-xs tracking-[0.3em] text-gold">
            EST. 2025 · DEVELOPED BY N16Q
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
