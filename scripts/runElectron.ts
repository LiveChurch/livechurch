import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { ElectronBuild } from "./ElectronBuild";

/** In Node/Bun, `require("electron")` returns the path to the executable. */
const electronPath: string = createRequire(import.meta.url)("electron");

const linuxArgs =
  process.platform === "linux"
    ? [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--enable-features=UseOzonePlatform",
        "--ozone-platform-hint=auto",
      ]
    : [];

await ElectronBuild.buildAll();

const child = spawn(electronPath, [...linuxArgs, "."], {
  cwd: ElectronBuild.root,
  env: {
    ...process.env,
    ...(process.platform === "linux" ? { ELECTRON_DISABLE_SANDBOX: "1" } : {}),
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to launch Electron:", error);
  process.exit(1);
});
