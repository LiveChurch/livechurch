"use client";

import { CueLabel } from "@/components/ui/CueLabel";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { SiteConfig } from "@/core/constants/SiteConfig";
import { useI18n } from "@/core/i18n/I18nProvider";
import type { InstallerChoice } from "./useInstallerChoice";

/** Last step: direct link to the installer on GitHub Releases, with no sign-up or server. */
export function InstallerDownload({ choice }: { choice: InstallerChoice }) {
  const { t } = useI18n();
  const { status, platform, release, installer } = choice;

  return (
    <section className="flex flex-col items-start gap-5">
      <CueLabel cue="03" label={t("download.file.label")} className="text-accent" />

      {status === "loading" && <p className="text-dim">{t("download.file.loading")}</p>}
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-accent">
          {t("download.file.loadError")}
        </p>
      )}
      {status === "ready" && !installer && <p className="text-dim">{t("download.file.noInstaller")}</p>}

      {installer && release && (
        <DownloadButton fileUrl={installer.url}>
          {t("download.file.button", { platform: platform.label, version: release.version })}
        </DownloadButton>
      )}

      <p className="text-dim">{t(`download.platforms.${platform.id}.installHint`)}</p>
      <a
        href={SiteConfig.releasesPage}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent hover:underline"
      >
        {t("download.file.allReleases")}
      </a>
    </section>
  );
}
