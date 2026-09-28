/**
 * Electron entry point (`main` in package.json, compiled to build/electron/loader.cjs).
 *
 * In development it loads the `main.cjs` next to it. Packaged, it chooses between the bundle that
 * came with the installer (`bundle/`) and a bundle downloaded by an update
 * (`<userData>/updates/current.json`) and runs its `main.jsc` (bytecode).
 */
import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import "bytenode";

interface BundleInfo {
  version: string;
  electronVersion: string;
}

interface Bundle {
  dir: string;
  info: BundleInfo;
}

interface UpdatePointer {
  version: string;
  /** Version of the installer bundle the update was downloaded on top of. */
  baseVersion: string;
  /** Path of bundle.asar relative to `<userData>/updates`. */
  file: string;
}

const USE_BUNDLE = app.isPackaged || process.env.LIVECHURCH_USE_BUNDLE === "1";
const POINTER_FILE = path.join(app.getPath("userData"), "updates", "current.json");
const BUILTIN_DIR = app.isPackaged
  ? path.join(app.getAppPath(), "bundle")
  : path.join(app.getAppPath(), "build", "bundle");

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    const isMissing = error instanceof Error && "code" in error && error.code === "ENOENT";
    if (!isMissing) console.error(`[Loader] Falha ao ler ${file}:`, error);
    return null;
  }
}

function readBundle(dir: string): Bundle | null {
  const info = readJson<BundleInfo>(path.join(dir, "bundle.json"));
  return info ? { dir, info } : null;
}

/** The downloaded bundle only applies on top of the installer that originated it and with the same Electron (the bytecode depends on V8). */
function pickUpdatedBundle(builtin: Bundle): Bundle | null {
  const pointer = readJson<UpdatePointer>(POINTER_FILE);
  if (!pointer) return null;

  const updated = readBundle(path.join(path.dirname(POINTER_FILE), pointer.file));
  const isCompatible =
    updated !== null &&
    pointer.baseVersion === builtin.info.version &&
    updated.info.electronVersion === process.versions.electron;
  return isCompatible ? updated : null;
}

function run(bundle: Bundle, baseVersion: string) {
  process.env.LIVECHURCH_BUNDLE_DIR = bundle.dir;
  process.env.LIVECHURCH_BUNDLE_VERSION = bundle.info.version;
  process.env.LIVECHURCH_BASE_VERSION = baseVersion;
  console.log(`[Loader] Executando bundle ${bundle.info.version} (base ${baseVersion}) de ${bundle.dir}`);
  require(path.join(bundle.dir, "main.jsc"));
}

/** An updated bundle that fails to start is discarded and the app goes back to the installer's. */
function runWithRollback(updated: Bundle, builtin: Bundle) {
  try {
    run(updated, builtin.info.version);
  } catch (error) {
    console.error("[Loader] Bundle atualizado falhou, voltando ao do instalador:", error);
    fs.rmSync(POINTER_FILE, { force: true });
    app.relaunch();
    app.exit(0);
  }
}

function start() {
  if (!USE_BUNDLE) {
    require("./main.cjs");
    return;
  }

  const builtin = readBundle(BUILTIN_DIR);
  if (!builtin) throw new Error(`Bundle não encontrado em ${BUILTIN_DIR}`);

  const updated = pickUpdatedBundle(builtin);
  if (updated) runWithRollback(updated, builtin);
  else run(builtin, builtin.info.version);
}

start();
