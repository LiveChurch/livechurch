"use client";

import { useI18n } from "@/core/i18n/I18nProvider";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { HymnBoard } from "@/components/ui/HymnBoard";
import { CueLabel } from "@/components/ui/CueLabel";

export function FreeSection() {
  const { t, tm } = useI18n();

  return (
    <section id="free" className="grain relative bg-band text-band-fg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 px-5 py-28 lg:flex-row lg:gap-20">
        <div className="flex flex-1 justify-center">
          <HymnBoard />
        </div>

        <div className="flex flex-1 flex-col items-start gap-6">
          <CueLabel label={t("free.label")} className="text-band-accent" />
          <h2 className="font-display text-4xl leading-tight md:text-5xl">{t("free.title")}</h2>
          <p className="text-lg leading-relaxed text-band-fg/80">{t("free.intro")}</p>
          <ul className="flex list-disc flex-col gap-2.5 pl-5 marker:text-band-accent">
            {tm<string[]>("free.included").map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <DownloadButton />
        </div>
      </div>
    </section>
  );
}
