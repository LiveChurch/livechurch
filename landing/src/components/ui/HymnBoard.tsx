"use client";

import type { CSSProperties } from "react";
import { useI18n } from "@/core/i18n/I18nProvider";

const SLAT_STAGGER_MS = 110;

/** Hymn number board, like those on church walls, showing the price zero. */
export function HymnBoard() {
  const { t } = useI18n();
  const slats = Array.from(t("free.price"));

  return (
    <figure className="flex flex-col items-center gap-4 rounded-2xl border-8 border-[#3b2314] bg-[#0b0807] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex gap-1.5 [perspective:600px]" role="img" aria-label={t("free.priceLabel")}>
        {slats.map((slat, index) => (
          <span
            key={index}
            className={`slat flex items-center justify-center py-4 font-display text-4xl sm:text-6xl ${
              slat === " "
                ? "px-1"
                : "rounded-sm bg-chalk px-2.5 text-soot shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] sm:px-4"
            }`}
            style={{ "--slat-delay": `${index * SLAT_STAGGER_MS}ms` } as CSSProperties}
          >
            {slat === " " ? " " : slat}
          </span>
        ))}
      </div>
      <figcaption className="font-display text-xl text-ember">{t("free.boardCaption")}</figcaption>
    </figure>
  );
}
