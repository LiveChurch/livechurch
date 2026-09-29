import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ServerPaths } from "../../shared/ServerPaths";
import { AppProcess } from "./AppProcess";

function isInsideOneDrive(dir: string): boolean {
  const oneDrive = process.env.OneDrive;
  return !!oneDrive && path.resolve(dir).toLowerCase().startsWith(path.resolve(oneDrive).toLowerCase());
}

/**
 * Pasta de saída do electron-builder. Dentro do OneDrive ele falha com EPERM (o OneDrive trava a
 * pasta que o electron-builder renomeia), então nesse caso a saída vai para `~/LiveChurch-release`.
 * `LIVECHURCH_INSTALLER_DIR` sobrescreve a escolha.
 */
function resolveOutputDir(): string {
  if (process.env.LIVECHURCH_INSTALLER_DIR) return process.env.LIVECHURCH_INSTALLER_DIR;
  if (isInsideOneDrive(ServerPaths.appRoot)) return path.join(os.homedir(), "LiveChurch-release");
  return path.join(ServerPaths.appRoot, "release");
}

const OUTPUT_DIR = resolveOutputDir();

const INSTALLER_EXTENSION: Partial<Record<NodeJS.Platform, string>> = {
  win32: ".exe",
  linux: ".AppImage",
  darwin: ".dmg",
};

function extensionFor(platform: NodeJS.Platform): string {
  const extension = INSTALLER_EXTENSION[platform];
  if (!extension) throw new Error(`Sem instalador para ${platform}.`);
  return extension;
}

export const InstallerBuild = {
  /** Empacota `build/bundle` + loader com o electron-builder e devolve o instalador gerado. */
  build(version: string): string {
    const extension = extensionFor(process.platform);

    AppProcess.run(AppProcess.nodeModule("electron-builder/cli.js"), [
      "--publish",
      "never",
      `--config.directories.output=${OUTPUT_DIR}`,
    ]);

    const installer = InstallerBuild.find(version);
    if (!installer) throw new Error(`Instalador ${extension} da versão ${version} não encontrado em ${OUTPUT_DIR}.`);
    return installer;
  },

  /** Instalador mais recente da versão para este sistema, ou null se ainda não foi gerado. */
  find(version: string): string | null {
    const extension = extensionFor(process.platform);
    if (!fs.existsSync(OUTPUT_DIR)) return null;

    // "LiveChurch Setup 0.0.1.exe" é da 0.0.1, mas "LiveChurch Setup 0.0.10.exe" não.
    const isThisVersion = (name: string) => {
      const baseName = name.slice(0, -extension.length);
      return baseName.endsWith(version) && !/[\d.]/.test(baseName.charAt(baseName.length - version.length - 1));
    };

    return (
      fs
        .readdirSync(OUTPUT_DIR)
        .filter((name) => name.endsWith(extension) && isThisVersion(name))
        .map((name) => path.join(OUTPUT_DIR, name))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] ?? null
    );
  },
};
