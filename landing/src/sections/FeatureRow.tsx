"use client";

import type { CoreFeature } from "@/core/content/features";
import { useI18n } from "@/core/i18n/I18nProvider";
import { CueLabel } from "@/components/ui/CueLabel";
import { Reveal } from "@/components/ui/Reveal";
import { WindowFrame } from "@/components/ui/WindowFrame";

function layoutClass(feature: CoreFeature, reverse?: boolean) {
  if (feature.wide) return "lg:flex-col lg:items-stretch";
  return reverse ? "lg:flex-row-reverse" : "lg:flex-row";
}

export function FeatureRow({ feature, reverse }: { feature: CoreFeature; reverse?: boolean }) {
  const { t, tm } = useI18n();
  const key = `features.${feature.id}`;

  return (
    <article className={`flex flex-col items-center gap-10 lg:gap-16 ${layoutClass(feature, reverse)}`}>
      <div className={`flex flex-1 flex-col items-start gap-5 ${feature.wide ? "max-w-2xl" : ""}`}>
        <CueLabel cue={feature.cue} label={t(`${key}.label`)} className="text-accent" />
        <h3 className="font-display text-3xl leading-tight md:text-4xl">{t(`${key}.title`)}</h3>
        <p className="text-lg leading-relaxed text-dim">{t(`${key}.text`)}</p>
        <ul className="flex list-disc flex-col gap-2.5 pl-5 marker:text-accent">
          {tm<string[]>(`${key}.bullets`).map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>

      <Reveal className="w-full flex-[1.4]">
        <WindowFrame name={tm<string | undefined>(`${key}.image`) ?? feature.image} alt={t(`${key}.imageAlt`)} />
      </Reveal>
    </article>
  );
}
