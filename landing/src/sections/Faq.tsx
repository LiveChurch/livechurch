"use client";

import { useI18n } from "@/core/i18n/I18nProvider";

interface FaqItem {
  question: string;
  answer: string;
}

export function Faq() {
  const { t, tm } = useI18n();

  return (
    <section id="faq" className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-28">
      <h2 className="font-display text-4xl md:text-5xl">{t("faq.title")}</h2>

      <div className="flex flex-col divide-y divide-edge border-y border-edge">
        {tm<FaqItem[]>("faq.items").map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                className="text-2xl text-accent transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="pb-5 text-dim">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
