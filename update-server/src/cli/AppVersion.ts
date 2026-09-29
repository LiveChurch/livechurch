import fs from "node:fs";
import { ServerPaths } from "../shared/ServerPaths";

const VERSION_PATTERN = /"version":\s*"(\d+\.\d+\.\d+)"/;

function nextVersion(current: string, spec: string): string {
  if (/^\d+\.\d+\.\d+$/.test(spec)) return spec;
  if (spec === "current") return current;

  const [major, minor, patch] = current.split(".").map(Number);
  if (spec === "major") return `${major + 1}.0.0`;
  if (spec === "minor") return `${major}.${minor + 1}.0`;
  if (spec === "patch") return `${major}.${minor}.${patch + 1}`;
  throw new Error(`Versão inválida: "${spec}". Use patch, minor, major, current ou x.y.z.`);
}

/** The app version lives in package.json's `version` (the renderer also reads it from there when compiling). */
export const AppVersion = {
  read(): string {
    const match = VERSION_PATTERN.exec(fs.readFileSync(ServerPaths.appPackageFile, "utf8"));
    if (!match) throw new Error("Versão não encontrada no package.json do app.");
    return match[1];
  },

  write(version: string) {
    const source = fs.readFileSync(ServerPaths.appPackageFile, "utf8");
    fs.writeFileSync(
      ServerPaths.appPackageFile,
      source.replace(VERSION_PATTERN, `"version": "${version}"`),
    );
  },

  /** Writes the new version to package.json and returns it, along with the previous one to undo if the build fails. */
  bump(spec: string): { previous: string; next: string } {
    const previous = AppVersion.read();
    const next = nextVersion(previous, spec);
    AppVersion.write(next);
    return { previous, next };
  },
};
