"use client";

import { BasePathUtils } from "@/core/utils/BasePathUtils";
import { useI18n } from "@/core/i18n/I18nProvider";

interface WindowFrameProps {
  /** File in screenshots/<language>/ without extension; there is a `-light` version of each. */
  name: string;
  alt: string;
  eager?: boolean;
}

export function WindowFrame({ name, alt, eager }: WindowFrameProps) {
  const { locale } = useI18n();
  const base = BasePathUtils.url(`/screenshots/${locale}/${name}`);

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-surface shadow-2xl shadow-black/25">
      <img src={`${base}.png`} alt={alt} loading={eager ? "eager" : "lazy"} className="only-dark block w-full" />
      <img src={`${base}-light.png`} alt={alt} loading="lazy" className="only-light w-full" />
    </div>
  );
}
