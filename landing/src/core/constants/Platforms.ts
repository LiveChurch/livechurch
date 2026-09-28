import type { IconName } from "@/components/ui/iconPaths";

export type PlatformId = "windows" | "linux";

export interface PlatformInfo {
  id: PlatformId;
  label: string;
  icon: IconName;
  /** Extension (lowercase) of the installer published on GitHub Releases. */
  installerExtension: string;
}

export const PLATFORMS: readonly PlatformInfo[] = [
  { id: "windows", label: "Windows", icon: "windows", installerExtension: ".exe" },
  { id: "linux", label: "Linux", icon: "linux", installerExtension: ".appimage" },
];
