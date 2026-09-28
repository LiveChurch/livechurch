"use client";

import { useEffect, useState } from "react";
import { PLATFORMS, type PlatformId } from "@/core/constants/Platforms";
import { useInstallerReleases } from "@/core/hooks/useInstallerReleases";
import { PlatformUtils } from "@/core/utils/PlatformUtils";

/** System and version chosen, based on the installers that exist on GitHub Releases. */
export function useInstallerChoice() {
  const releasesState = useInstallerReleases();
  const [detectedPlatformId, setDetectedPlatformId] = useState<PlatformId | null | undefined>(undefined);
  const [platformId, setPlatformId] = useState<PlatformId>("windows");
  const [chosenVersion, setChosenVersion] = useState<string | null>(null);

  // The system is only known in the browser; detecting it here avoids a hydration mismatch.
  useEffect(() => {
    const detected = PlatformUtils.detect();
    setDetectedPlatformId(detected);
    if (detected) setPlatformId(detected);
  }, []);

  const platform = PLATFORMS.find((item) => item.id === platformId) ?? PLATFORMS[0];
  const releases =
    releasesState.status === "ready" ? releasesState.releases.filter((item) => item.installers[platformId]) : [];
  const release = releases.find((item) => item.version === chosenVersion) ?? releases[0];

  return {
    status: releasesState.status,
    detectedPlatformId,
    platform,
    releases,
    release,
    installer: release?.installers[platformId],
    setPlatformId,
    setVersion: setChosenVersion,
  };
}

export type InstallerChoice = ReturnType<typeof useInstallerChoice>;
