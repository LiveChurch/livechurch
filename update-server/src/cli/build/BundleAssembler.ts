import fs from "node:fs";
import path from "node:path";
import { createPackage } from "@electron/asar";
import { AppProcess } from "./AppProcess";
import { ElectronBundle } from "./ElectronBundle";
import { RendererBundle } from "./RendererBundle";

const BUNDLE_DIR = path.join(AppProcess.buildDir, "bundle");
const INFO_FILE = path.join(BUNDLE_DIR, "bundle.json");

export interface BundleInfo {
  version: string;
  /** O bytecode do main só roda neste Electron. */
  electronVersion: string;
}

/**
 * Monta `build/bundle/` com tudo que o `loader.ts` executa:
 *   bundle.json  versão do bundle e do Electron que o compilou
 *   main.jsc     processo principal em bytecode
 *   preload.cjs  preload ofuscado
 *   renderer/    interface Vue compilada e ofuscada
 */
export const BundleAssembler = {
  dir: BUNDLE_DIR,

  async assemble(version: string): Promise<BundleInfo> {
    fs.rmSync(BUNDLE_DIR, { recursive: true, force: true });
    fs.mkdirSync(BUNDLE_DIR, { recursive: true });

    console.log("Renderer (Vite + ofuscação)");
    RendererBundle.build(path.join(BUNDLE_DIR, "renderer"));

    console.log("Main (bytecode) e preload");
    await ElectronBundle.build(BUNDLE_DIR);

    const info: BundleInfo = { version, electronVersion: AppProcess.electronVersion() };
    fs.writeFileSync(INFO_FILE, JSON.stringify(info, null, 2));
    return info;
  },

  /** Bundle montado por último, ou null se `build/bundle/` ainda não existe. */
  readInfo(): BundleInfo | null {
    if (!fs.existsSync(INFO_FILE)) return null;
    return JSON.parse(fs.readFileSync(INFO_FILE, "utf8"));
  },

  /** Onde fica o `.asar` da versão (o arquivo pode ainda não existir). */
  archivePath: (version: string) => path.join(AppProcess.buildDir, `livechurch-${version}.asar`),

  /** Empacota o bundle em um único `.asar` (o Electron lê direto dele, sem extrair). */
  async pack(version: string): Promise<string> {
    const archive = BundleAssembler.archivePath(version);
    await createPackage(BUNDLE_DIR, archive);
    return archive;
  },
};
