import type { UpdateType } from "../../src/core/types/update";

/** `<platform>.json` from the releases repository (`ReleaseManifest` in update-server). */
export interface UpdateRelease {
  platform: string;
  version: string;
  type: UpdateType;
  bundleUrl: string;
  sha256: string;
  /** Ed25519 (base64) sobre `platform|version|type|sha256`. */
  signature: string;
  size: number;
  /** Electron version the bundle was compiled with (the bytecode only runs on it). */
  electronVersion: string;
  notes: string | null;
  publishedAt: string;
}
