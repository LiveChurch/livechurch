"use client";

import { useI18n } from "@/core/i18n/I18nProvider";

interface Fact {
  value: string;
  label: string;
}

export function FactsStrip() {
  const { t, tm } = useI18n();

  return (
    <section className="border-y border-edge bg-surface" aria-label={t("facts.label")}>
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-10 gap-y-6 px-5 py-8">
        {tm<Fact[]>("facts.items").map((fact) => (
          <li key={fact.label} className="flex flex-col gap-1">
            <span className="font-display text-3xl text-accent">{fact.value}</span>
            <span className="text-sm text-dim">{fact.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
