import fs from "node:fs";
import JavaScriptObfuscator, { type ObfuscatorOptions } from "javascript-obfuscator";

/**
 * Ofuscação moderada: esconde nomes e textos sem os recursos que multiplicam o tamanho
 * ou a lentidão (control flow flattening, código morto) e sem os que quebram o app
 * (auto-defesa, debug protection).
 */
const BASE_OPTIONS: ObfuscatorOptions = {
  compact: true,
  simplify: true,
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,
  stringArray: true,
  stringArrayThreshold: 0.75,
  stringArrayEncoding: ["base64"],
  rotateStringArray: true,
  shuffleStringArray: true,
  numbersToExpressions: true,
  log: false,
  sourceMap: false,
};

function obfuscate(code: string, options: ObfuscatorOptions): string {
  return JavaScriptObfuscator.obfuscate(code, { ...BASE_OPTIONS, ...options }).getObfuscatedCode();
}

export const Obfuscator = {
  /** Código do Chromium: módulos ES (chunks do Vite). */
  renderer: (code: string) => obfuscate(code, { target: "browser", sourceType: "module" }),

  /** Código do Electron/Node: scripts CommonJS (main e preload). */
  node: (code: string) => obfuscate(code, { target: "node", sourceType: "script" }),

  /** Lê `source`, ofusca e grava em `destination` (pode ser o mesmo arquivo). */
  file(source: string, destination: string, transform: (code: string) => string) {
    fs.writeFileSync(destination, transform(fs.readFileSync(source, "utf8")));
  },
};
