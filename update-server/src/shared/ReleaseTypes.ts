/** `code`: only the app code (bundle.asar). `full`: complete installer with Electron. */
export type ReleaseType = "code" | "full";

/**
 * Latest release of a platform: `<platform>.json` in the releases repository, downloaded
 * by the app. The app expects exactly this format (`electron/update/UpdateTypes.ts`).
 */
export interface ReleaseManifest {
  platform: string;
  version: string;
  type: ReleaseType;
  /** Link to the binary on GitHub Releases. */
  bundleUrl: string;
  sha256: string;
  /** Ed25519 (base64) sobre `platform|version|type|sha256`. */
  signature: string;
  size: number;
  /** Electron version the release was compiled with (the bytecode only runs on it). */
  electronVersion: string;
  notes: string | null;
  publishedAt: string;
}
