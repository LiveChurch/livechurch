"use client";

import { useI18n } from "@/core/i18n/I18nProvider";

export function DownloadIntro() {
  const { t } = useI18n();

  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-display text-4xl leading-tight md:text-5xl">{t("download.title")}</h1>
      <p className="text-lg text-dim">{t("download.intro")}</p>
    </header>
  );
}
