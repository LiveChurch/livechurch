import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const APP_ROOT = path.resolve(ROOT, "..");

export const ServerPaths = {
  /** Root of the update-server. */
  root: ROOT,
  /** Root of the LiveChurch app (where package.json, electron/ and src/ live). */
  appRoot: APP_ROOT,
  /** Local copy of each release (`releases/<version>/`) with the binary uploaded to GitHub. */
  releasesDir: path.join(ROOT, "releases"),
  privateKeyFile: path.join(ROOT, "keys", "private.pem"),
  /** App module that loads the public key used to verify the signatures. */
  appPublicKeyFile: path.join(APP_ROOT, "electron", "update", "publicKey.ts"),
  appPackageFile: path.join(APP_ROOT, "package.json"),
};
