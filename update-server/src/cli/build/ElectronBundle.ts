import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import { compileFile } from "bytenode";
import { ServerPaths } from "../../shared/ServerPaths";
import { AppProcess } from "./AppProcess";
import { Obfuscator } from "./Obfuscator";

const COMPILED_DIR = path.join(AppProcess.buildDir, "electron");
const TEMP_DIR = path.join(AppProcess.buildDir, "tmp");
const RUNTIME_MODULES = new Set([...builtinModules, "electron", "original-fs"]);

/**
 * O bundle atualizado roda de `<userData>/updates`, sem `node_modules` por perto: um `require` de
 * pacote externo faria a atualização falhar ao iniciar (e o loader voltaria ao bundle do instalador).
 */
function assertSelfContained(file: string) {
  const source = fs.readFileSync(file, "utf8");
  const external = [...source.matchAll(/require\("([^"]+)"\)/g)]
    .map((match) => match[1])
    .filter((name) => !name.startsWith("node:") && !name.startsWith(".") && !RUNTIME_MODULES.has(name));

  if (external.length > 0) {
    throw new Error(`${path.basename(file)} depende de pacotes fora do bundle: ${[...new Set(external)].join(", ")}.`);
  }
  // `createRequire` carrega arquivos em tempo de execução, relativos ao bundle, que não estão nele.
  if (source.includes(".createRequire(")) {
    throw new Error(`${path.basename(file)} usa createRequire: alguma dependência não foi embutida por inteiro.`);
  }
}

export const ElectronBundle = {
  /**
   * Compila o main e o preload do Electron. O main vira bytecode V8 (`main.jsc`), gerado com o
   * próprio Electron do app (o bytecode só carrega na mesma versão); o preload roda em sandbox,
   * onde bytecode não é possível, então só é ofuscado.
   */
  async build(bundleDir: string) {
    AppProcess.run(path.join(ServerPaths.appRoot, "scripts", "buildElectron.ts"));
    assertSelfContained(path.join(COMPILED_DIR, "main.cjs"));
    assertSelfContained(path.join(COMPILED_DIR, "preload.cjs"));

    fs.mkdirSync(TEMP_DIR, { recursive: true });
    const obfuscatedMain = path.join(TEMP_DIR, "main.js");
    Obfuscator.file(path.join(COMPILED_DIR, "main.cjs"), obfuscatedMain, Obfuscator.node);
    await compileFile({
      filename: obfuscatedMain,
      output: path.join(bundleDir, "main.jsc"),
      electron: true,
      electronPath: AppProcess.electronPath(),
    });

    Obfuscator.file(
      path.join(COMPILED_DIR, "preload.cjs"),
      path.join(bundleDir, "preload.cjs"),
      Obfuscator.node,
    );
  },
};
