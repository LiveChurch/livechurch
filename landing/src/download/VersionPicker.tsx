"use client";

import { CueLabel } from "@/components/ui/CueLabel";
import { useI18n } from "@/core/i18n/I18nProvider";
import type { InstallerRelease } from "@/core/types/release";
import { OptionCard } from "./OptionCard";

interface VersionPickerProps {
  /** Versions that have an installer for the chosen system, from most recent to oldest. */
  releases: readonly InstallerRelease[];
  selected: string | undefined;
  onSelect: (version: string) => void;
}

export function VersionPicker({ releases, selected, onSelect }: VersionPickerProps) {
  const { t } = useI18n();
  if (releases.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <CueLabel cue="02" label={t("download.version.label")} className="text-accent" />
      <div role="radiogroup" aria-label={t("download.version.ariaLabel")} className="flex flex-col gap-3">
        {releases.map((release, index) => (
          <OptionCard
            key={release.version}
            selected={selected === release.version}
            onSelect={() => onSelect(release.version)}
          >
            <span className="flex flex-1 items-center gap-3">
              <span className="font-mono text-lg font-semibold">v{release.version}</span>
              {index === 0 && (
                <span className="rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {t("download.version.latest")}
                </span>
              )}
            </span>
          </OptionCard>
        ))}
      </div>
    </section>
  );
}
