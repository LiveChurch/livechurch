"use client";

import { InstallerDownload } from "./InstallerDownload";
import { PlatformPicker } from "./PlatformPicker";
import { VersionPicker } from "./VersionPicker";
import { useInstallerChoice } from "./useInstallerChoice";

/** Steps of the download page: system, version and the direct link to the file on GitHub. */
export function DownloadFlow() {
  const choice = useInstallerChoice();

  return (
    <>
      <PlatformPicker
        selectedId={choice.platform.id}
        detectedId={choice.detectedPlatformId}
        onSelect={choice.setPlatformId}
      />
      <VersionPicker releases={choice.releases} selected={choice.release?.version} onSelect={choice.setVersion} />
      <InstallerDownload choice={choice} />
    </>
  );
}
