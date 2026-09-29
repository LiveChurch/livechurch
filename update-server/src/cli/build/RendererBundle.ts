import fs from "node:fs";
import path from "node:path";
import { AppProcess } from "./AppProcess";
import { Obfuscator } from "./Obfuscator";

/**
 * Chunks que não são código do app (bibliotecas e as Bíblias/harpa em JSON): ofuscá-los só
 * incharia o bundle. Os nomes vêm do `manualChunks` do vite.config.ts do app.
 */
const UNOBFUSCATED_CHUNKS = ["vendor-", "data-"];

export const RendererBundle = {
  /** Compila o Vue com o Vite e ofusca os chunks de código do app. */
  build(outDir: string) {
    AppProcess.run(AppProcess.nodeModule("vite/bin/vite.js"), [
      "build",
      "--outDir",
      outDir,
      "--emptyOutDir",
    ]);

    const assetsDir = path.join(outDir, "assets");
    const appChunks = fs
      .readdirSync(assetsDir)
      .filter((name) => name.endsWith(".js"))
      .filter((name) => !UNOBFUSCATED_CHUNKS.some((prefix) => name.startsWith(prefix)));

    for (const chunk of appChunks) {
      const file = path.join(assetsDir, chunk);
      Obfuscator.file(file, file, Obfuscator.renderer);
      console.log(`  ofuscado: assets/${chunk}`);
    }
  },
};
