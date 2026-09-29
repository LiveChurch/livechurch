import type { PlatformId } from "@/core/constants/Platforms";

export interface Installer {
  name: string;
  url: string;
}

/** Version published on GitHub with the installers it brings, per system. */
export interface InstallerRelease {
  version: string;
  installers: Partial<Record<PlatformId, Installer>>;
}
