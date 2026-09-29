import fs from "original-fs";
import path from "node:path";
import { app } from "electron";

const updatesDir = () => path.join(app.getPath("userData"), "updates");
const pointerFile = () => path.join(updatesDir(), "current.json");

/**
 * Keeps the downloaded bundles in `<userData>/updates/<version>/bundle.asar`.
 * `current.json` tells which one `loader.ts` should run.
 * Uses `original-fs` because Electron's `fs` treats any `.asar` as a virtual folder.
 */
export const BundleStore = {
  bundlePathFor(version: string): string {
    return path.join(updatesDir(), version, "bundle.asar");
  },

  /** Installs the bundle downloaded to `downloadedFile`, uses it from the next startup and deletes the previous ones. */
  install(downloadedFile: string, version: string, baseVersion: string) {
    fs.renameSync(downloadedFile, BundleStore.bundlePathFor(version));

    const pointer = { version, baseVersion, file: path.join(version, "bundle.asar") };
    fs.writeFileSync(pointerFile(), JSON.stringify(pointer, null, 2));

    for (const entry of fs.readdirSync(updatesDir(), { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== version) {
        fs.rmSync(path.join(updatesDir(), entry.name), { recursive: true, force: true });
      }
    }
  },
};
