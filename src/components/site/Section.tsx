import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 pt-14">
      <Reveal className="mb-12 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-gold">{kicker.toUpperCase()}</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
          <span className="shine-text">{title}</span>
        </h2>
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </Reveal>
      {children}
    </section>
  );
}
