import { createFileRoute } from "@tanstack/react-router";
import { Car, Sparkles, UserPlus, Users, Building2, Lock, Info } from "lucide-react";
import { useLang, DISCORD_URL } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "المتجر — Arab First RP" },
      {
        name: "description",
        content:
          "متجر Arab First RP: شراء سيارة 30 روبوكس، سيارة ون ادشن 200، شخصية ثانية 100، شخصية ثالثة 150، ومقر خاص 100 روبوكس.",
      },
      { property: "og:title", content: "Store — Arab First RP" },
      {
        property: "og:description",
        content: "Cars, exclusive editions, extra characters and private bases — priced in Robux.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorePage,
});

const icons = [Car, Sparkles, UserPlus, Users, Building2];

function StorePage() {
  const { t, dict } = useLang();

  return (
    <Section kicker={t(dict.store.k)} title={t(dict.store.t)}>
      <Reveal>
        <p className="mx-auto -mt-6 mb-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          {t(dict.store.p)}
        </p>
      </Reveal>

      <div className="scene-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dict.store.items.map((item, idx) => {
          const Icon = icons[idx]!;
          const popular = item.tag === "popular";
          const locked = item.tag === "req";
          return (
            <Reveal key={item.t[1]} delay={idx * 70}>
              <div
                className={`surface-card card-3d group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-500 ${
                  popular ? "gold-ring shadow-[0_25px_60px_-30px_var(--gold)]" : ""
                }`}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl transition-all duration-500 group-hover:bg-gold/20" />

                {popular && (
                  <span className="absolute end-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-black tracking-wider text-primary-foreground">
                    {t(dict.store.popular)}
                  </span>
                )}

                <div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/12 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-display text-xl font-extrabold">{t(item.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.d)}</p>

                {locked && (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-2/70 px-2.5 py-1.5 text-[11px] font-semibold text-gold">
                    <Lock className="h-3 w-3" />
                    {t(dict.store.req)}
                  </p>
                )}

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="font-tech text-4xl font-black text-gold-gradient">
                    {item.price}
                  </span>
                  <span className="pb-1 text-xs font-semibold text-muted-foreground">
                    {t(dict.store.currency)}
                  </span>
                </div>

                <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-auto block rounded-full px-5 py-3 text-center text-sm font-bold transition-transform hover:scale-[1.03] ${
                    popular
                      ? "bg-gold text-primary-foreground"
                      : "border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
                  }`}
                >
                  {t(dict.store.buy)}
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={200}>
        <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 text-gold" />
          {t(dict.store.note)}
        </p>
      </Reveal>
    </Section>
  );
}
