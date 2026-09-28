import { ElectronBuild } from "./ElectronBuild";

/** Compiles Electron's loader, main and preload to `build/electron/` (used by the update-server release). */
await ElectronBuild.buildAll();
