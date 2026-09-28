import type { PlatformId } from "@/core/constants/Platforms";

export const PlatformUtils = {
  /** Visitor's system (browser only), or null when there is no installer for it (macOS, phones...). */
  detect(): PlatformId | null {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("windows")) return "windows";
    if (userAgent.includes("linux") && !userAgent.includes("android")) return "linux";
    return null;
  },
};
