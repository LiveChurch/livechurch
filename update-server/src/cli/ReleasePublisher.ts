import fs from "node:fs";
import path from "node:path";
import { ReleaseAssets } from "../shared/ReleaseAssets";
import type { ReleaseManifest } from "../shared/ReleaseTypes";
import { ServerPaths } from "../shared/ServerPaths";
import { ReleaseSigner } from "./ReleaseSigner";
import { GitHubCli } from "./github/GitHubCli";
import { GitHubManifest } from "./github/GitHubManifest";
import { GitHubRelease } from "./github/GitHubRelease";

interface PublishRequest {
  version: string;
  electronVersion: string;
  /** The version's `.asar`; required without `full`. */
  asarPath: string | null;
  /** The version's installer; required with `full`. */
  installerPath: string | null;
  /** The manifest points to the installer (when Electron changed) instead of the `.asar`. */
  full: boolean;
  notes: string | null;
}

interface UploadedFile {
  localPath: string;
  url: string;
}

const PLATFORM = `${process.platform}-${process.arch}`;

/** Copies to `releases/<version>/<fileName>` and uploads to the `v<version>` release. */
function upload(version: string, sourcePath: string, fileName: string, notes: string | null): UploadedFile {
  const localPath = path.join(ServerPaths.releasesDir, version, fileName);
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.copyFileSync(sourcePath, localPath);

  GitHubRelease.upload(version, localPath, notes);
  console.log(`Enviado: ${fileName}`);
  return { localPath, url: ReleaseAssets.downloadUrl(GitHubCli.repo, version, fileName) };
}

function buildManifest(request: PublishRequest, target: UploadedFile): ReleaseManifest {
  const type = request.full ? "full" : "code";
  const sha256 = ReleaseSigner.sha256File(target.localPath);
  return {
    platform: PLATFORM,
    version: request.version,
    type,
    bundleUrl: target.url,
    sha256,
    signature: ReleaseSigner.sign({ platform: PLATFORM, version: request.version, type, sha256 }),
    size: fs.statSync(target.localPath).size,
    electronVersion: request.electronVersion,
    notes: request.notes,
    publishedAt: new Date().toISOString(),
  };
}

export const ReleasePublisher = {
  /**
   * Uploads the version's installer and `.asar` to GitHub Releases and, only afterwards, publishes the platform's
   * signed manifest, so it never points to a missing file.
   */
  publish(request: PublishRequest): ReleaseManifest {
    const { version, asarPath, installerPath, full, notes } = request;
    if (full && !installerPath) throw new Error(`--full precisa do instalador da versão ${version}.`);
    if (!full && !asarPath) throw new Error(`Falta o .asar da versão ${version}.`);

    const installer = installerPath
      ? upload(version, installerPath, ReleaseAssets.setupFileName(version, PLATFORM, path.extname(installerPath)), notes)
      : null;
    const asar = asarPath ? upload(version, asarPath, ReleaseAssets.asarFileName(version, PLATFORM), notes) : null;

    const target = full ? installer : asar;
    if (!target) throw new Error("Nada para o manifesto apontar.");

    const manifest = buildManifest(request, target);
    GitHubManifest.publish(manifest);
    return manifest;
  },
};
