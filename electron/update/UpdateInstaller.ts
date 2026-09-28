import fs from "node:fs";
import path from "node:path";
import { app, shell } from "electron";
import { BundleStore } from "./BundleStore";
import { UpdateConfig } from "./UpdateConfig";
import { UpdateDownloader } from "./UpdateDownloader";
import { UpdateIntegrity } from "./UpdateIntegrity";
import type { UpdateRelease } from "./UpdateTypes";

export type ApplyUpdate = () => void | Promise<void>;

/** Downloads to `<destination>.part` (neutral extension, which Electron's `fs` reads normally), checks the hash and returns the downloaded path. */
async function downloadVerified(
  release: UpdateRelease,
  destination: string,
  onProgress: (progress: number) => void,
): Promise<string> {
  const partial = `${destination}.part`;
  await UpdateDownloader.download(release.bundleUrl, partial, onProgress);

  const sha256 = await UpdateIntegrity.sha256File(partial);
  if (sha256 !== release.sha256) {
    fs.rmSync(partial, { force: true });
    throw new Error("O arquivo baixado está corrompido (hash diferente do informado).");
  }
  return partial;
}

function installerPathFor(release: UpdateRelease): string {
  const fileName = decodeURIComponent(path.basename(new URL(release.bundleUrl).pathname));
  return path.join(app.getPath("temp"), "livechurch-update", fileName);
}

function relaunch() {
  app.relaunch();
  app.exit(0);
}

export const UpdateInstaller = {
  /** Downloads and checks the release. Returns the action that applies it (called when the user accepts restarting). */
  async prepare(
    release: UpdateRelease,
    onProgress: (progress: number) => void,
  ): Promise<ApplyUpdate> {
    if (release.type === "code") {
      const bundlePath = BundleStore.bundlePathFor(release.version);
      const downloaded = await downloadVerified(release, bundlePath, onProgress);
      BundleStore.install(downloaded, release.version, UpdateConfig.baseVersion);
      return relaunch;
    }

    const installerPath = installerPathFor(release);
    fs.renameSync(await downloadVerified(release, installerPath, onProgress), installerPath);
    return async () => {
      const failure = await shell.openPath(installerPath);
      if (failure) throw new Error(`Não foi possível abrir o instalador: ${failure}`);
      app.quit();
    };
  },
};
