import { ReleaseAssets } from "../../shared/ReleaseAssets";
import type { ReleaseManifest } from "../../shared/ReleaseTypes";
import { GitHubCli } from "./GitHubCli";

/** Identity of the release commits: same for author and committer, no linked account, so GitHub shows a single name. */
const releaseIdentity = { name: "LiveChurch", email: "releases@livechurch.app" };
const identityArgs = (role: "author" | "committer") => [
  "-f", `${role}[name]=${releaseIdentity.name}`,
  "-f", `${role}[email]=${releaseIdentity.email}`,
];

/** `<platform>.json` versioned in the releases repository; it is the file the app downloads. */
export const GitHubManifest = {
  /** Creates or replaces the platform manifest with a direct commit on the default branch (contents API). */
  publish(manifest: ReleaseManifest) {
    const filePath = ReleaseAssets.manifestPath(manifest.platform);
    const endpoint = `repos/${GitHubCli.repo}/contents/${filePath}`;
    const content = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`).toString("base64");

    // GitHub requires the sha of the current version to replace the file; without it, the file is created.
    const currentSha = GitHubCli.read(["api", endpoint, "--jq", ".sha"]);
    const args = [
      "api", "--method", "PUT", endpoint,
      "-f", `message=release: ${manifest.platform} v${manifest.version} (${manifest.type})`,
      "-f", `content=${content}`,
      ...identityArgs("author"),
      ...identityArgs("committer"),
      ...(currentSha ? ["-f", `sha=${currentSha}`] : []),
    ];

    if (!GitHubCli.run(args, true)) {
      throw new Error(`Falha ao publicar ${filePath} em ${GitHubCli.repo}. O binário já está no release.`);
    }
  },
};
