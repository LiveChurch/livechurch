import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { ServerPaths } from "../../shared/ServerPaths";

const appRequire = createRequire(ServerPaths.appPackageFile);

/** Ferramentas do próprio app (vite, electron-builder, electron) executadas a partir da raiz dele. */
export const AppProcess = {
  buildDir: path.join(ServerPaths.appRoot, "build"),

  /** Executa um script (`.js` ou `.ts`) com este mesmo runtime, na raiz do app. */
  run(script: string, args: string[] = []) {
    const result = spawnSync(process.execPath, [script, ...args], {
      cwd: ServerPaths.appRoot,
      stdio: "inherit",
    });
    if (result.status !== 0) {
      throw new Error(`Falhou: ${path.basename(script)} ${args.join(" ")}`.trim());
    }
  },

  /** Arquivo de dentro de `node_modules` do app. */
  nodeModule(relativePath: string): string {
    return path.join(ServerPaths.appRoot, "node_modules", relativePath);
  },

  electronVersion(): string {
    return appRequire("electron/package.json").version;
  },

  /** O pacote `electron` exporta o caminho do executável. */
  electronPath(): string {
    return appRequire("electron");
  },
};
