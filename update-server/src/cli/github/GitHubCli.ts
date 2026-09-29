import { spawnSync } from "node:child_process";

/** Public repository: binaries on GitHub Releases and one `releases/<platform>.json` per platform. */
const REPO = process.env.LIVECHURCH_RELEASES_REPO || "LiveChurch/livechurch";

function spawnGh(args: string[], stdout: "inherit" | "pipe" | "ignore") {
  const result = spawnSync("gh", args, { stdio: ["ignore", stdout, stdout], encoding: "utf8" });
  if (result.error) {
    throw new Error("GitHub CLI (gh) não encontrado. Instale com `winget install GitHub.cli` e rode `gh auth login`.");
  }
  return result;
}

/** GitHub CLI (`gh`), which already handles login; no token goes through the code. */
export const GitHubCli = {
  repo: REPO,

  /** Runs `gh`; returns whether it succeeded. `quiet` hides the output. */
  run(args: string[], quiet = false): boolean {
    return spawnGh(args, quiet ? "ignore" : "inherit").status === 0;
  },

  /** Runs `gh` and returns the output, or null if the command failed. */
  read(args: string[]): string | null {
    const result = spawnGh(args, "pipe");
    return result.status === 0 ? result.stdout.trim() : null;
  },
};
