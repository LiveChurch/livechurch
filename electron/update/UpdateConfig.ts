/** Root of the releases repository; it holds one `<platform>.json` per platform (`update-server`). */
const MANIFEST_BASE_URL = "https://raw.githubusercontent.com/LiveChurch/livechurch-releases/main";

export const UpdateConfig = {
  /** In tests, `LIVECHURCH_UPDATE_URL` points to another folder with the same `<platform>.json` files. */
  manifestBaseUrl: process.env.LIVECHURCH_UPDATE_URL || MANIFEST_BASE_URL,
  platform: `${process.platform}-${process.arch}`,
  firstCheckDelayMs: 10_000,
  checkIntervalMs: 60 * 60 * 1000,
  requestTimeoutMs: 10_000,
  currentVersion: process.env.LIVECHURCH_BUNDLE_VERSION || "0.0.0",
  /** Version of the bundle that came with the installer; the downloaded bundle only applies on top of it. */
  baseVersion: process.env.LIVECHURCH_BASE_VERSION || "0.0.0",
};
