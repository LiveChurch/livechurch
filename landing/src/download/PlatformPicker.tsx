"use client";

import { CueLabel } from "@/components/ui/CueLabel";
import { Icon } from "@/components/ui/Icon";
import { PLATFORMS, type PlatformId } from "@/core/constants/Platforms";
import { useI18n } from "@/core/i18n/I18nProvider";
import { OptionCard } from "./OptionCard";

interface PlatformPickerProps {
  selectedId: PlatformId;
  /** undefined while the browser has not been queried yet; null if there is no installer for it. */
  detectedId: PlatformId | null | undefined;
  onSelect: (id: PlatformId) => void;
}

export function PlatformPicker({ selectedId, detectedId, onSelect }: PlatformPickerProps) {
  const { t } = useI18n();

  return (
    <section className="flex flex-col gap-4">
      <CueLabel cue="01" label={t("download.system.label")} className="text-accent" />
      <div role="radiogroup" aria-label={t("download.system.ariaLabel")} className="flex flex-col gap-3 sm:flex-row">
        {PLATFORMS.map((platform) => (
          <OptionCard key={platform.id} selected={selectedId === platform.id} onSelect={() => onSelect(platform.id)}>
            <Icon name={platform.icon} size={32} className="text-accent" />
            <span className="flex flex-1 flex-col">
              <span className="text-lg font-semibold">{platform.label}</span>
              <span className="text-sm text-dim">{t(`download.platforms.${platform.id}.fileKind`)}</span>
            </span>
            {detectedId === platform.id && (
              <span className="rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                {t("download.system.detected")}
              </span>
            )}
          </OptionCard>
        ))}
      </div>
      {detectedId === null && <p className="text-sm text-dim">{t("download.system.unsupported")}</p>}
    </section>
  );
}
