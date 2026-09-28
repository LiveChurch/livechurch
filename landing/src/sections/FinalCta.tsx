"use client";

import { useI18n } from "@/core/i18n/I18nProvider";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";

export function FinalCta() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-t border-edge">
      <PhotoBackdrop src="backgrounds/worship-screen.jpg" position="center 88%" mono />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-5 py-28 text-center">
        <h2 className="font-display text-4xl leading-tight md:text-5xl">{t("finalCta.title")}</h2>
        <p className="max-w-xl text-lg text-dim">{t("finalCta.text")}</p>
        <div className="flex flex-col items-center gap-3">
          <DownloadButton />
          <p className="text-sm text-dim">
            {t("common.platforms")} · {t("common.openSource")} · {t("common.beta")}
          </p>
        </div>
      </div>
    </section>
  );
}
