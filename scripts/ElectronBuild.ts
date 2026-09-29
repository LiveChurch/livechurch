import path from "node:path";
import { build } from "vite";

const ROOT = path.resolve(import.meta.dirname, "..");

/** Each entry point becomes a single .cjs (the sandboxed preload cannot load other modules). */
const ENTRIES = ["loader", "main", "preload"] as const;

export type ElectronEntry = (typeof ENTRIES)[number];

const DEFAULT_OUT_DIR = path.join(ROOT, "build", "electron");

/**
 * Compiles `electron/<entry>.ts` to `<outDir>/<entry>.cjs`. Main and preload carry their dependencies
 * inside themselves: on an update, the bundle runs from `<userData>/updates`, away from the installer's
 * `node_modules`. Only the loader, which always stays in the installer, loads them from there.
 */
async function buildEntry(entry: ElectronEntry, outDir: string) {
  await build({
    root: ROOT,
    configFile: false,
    publicDir: false,
    logLevel: "warn",
    ssr: { noExternal: entry !== "loader" },
    resolve: {
      alias: {
        // font-list's ESM entry loads `./libs/core` with `createRequire` at runtime,
        // which the bundle cannot embed; the CommonJS entry is packaged whole.
        "font-list": path.join(ROOT, "node_modules", "font-list", "index.js"),
      },
    },
    build: {
      ssr: path.join(ROOT, "electron", `${entry}.ts`),
      outDir,
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        // Modules that Electron itself provides at runtime.
        external: ["electron", "original-fs"],
        output: { format: "cjs", entryFileNames: `${entry}.cjs` },
      },
    },
  });
}

export const ElectronBuild = {
  root: ROOT,
  defaultOutDir: DEFAULT_OUT_DIR,
  buildEntry,

  async buildAll(outDir = DEFAULT_OUT_DIR) {
    for (const entry of ENTRIES) await buildEntry(entry, outDir);
  },
};
