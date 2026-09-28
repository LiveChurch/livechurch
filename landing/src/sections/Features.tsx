"use client";

import { CORE_FEATURES, MORE_FEATURES } from "@/core/content/features";
import { useI18n } from "@/core/i18n/I18nProvider";
import { CueLabel } from "@/components/ui/CueLabel";
import { Icon } from "@/components/ui/Icon";
import { FeatureRow } from "./FeatureRow";

export function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="mx-auto flex max-w-6xl flex-col gap-28 px-5 py-28">
      <header className="flex max-w-2xl flex-col gap-4">
        <h2 className="font-display text-4xl leading-tight md:text-5xl">{t("featuresSection.title")}</h2>
        <p className="text-lg text-dim">{t("featuresSection.subtitle")}</p>
      </header>

      {CORE_FEATURES.map((feature, index) => (
        <FeatureRow key={feature.id} feature={feature} reverse={index % 2 === 1} />
      ))}

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <CueLabel label={t("featuresSection.alsoIncludes")} className="text-accent" />
          <h3 className="font-display text-3xl md:text-4xl">{t("featuresSection.moreTitle")}</h3>
        </div>
        <ul className="grid gap-x-16 md:grid-cols-2">
          {MORE_FEATURES.map((feature) => (
            <li key={feature.id} className="flex items-start gap-4 border-t border-edge py-6">
              <Icon name={feature.icon} size={22} className="mt-1 text-accent" />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-lg font-semibold">{t(`moreFeatures.${feature.id}.title`)}</h4>
                <p className="text-dim">{t(`moreFeatures.${feature.id}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
