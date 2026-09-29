import path from "node:path";
import { ReleaseAssets } from "../../shared/ReleaseAssets";
import { GitHubCli } from "./GitHubCli";

const repoArgs = () => ["--repo", GitHubCli.repo];

/** Binaries on GitHub Releases (one `v<version>` release per version, with each platform's files). */
export const GitHubRelease = {
  /** Checks before the build (which takes a while) that `gh` is logged in, sees the repository and that it accepts releases. */
  assertReady() {
    if (!GitHubCli.run(["release", "list", "--limit", "1", ...repoArgs()], true)) {
      throw new Error(`O gh não acessa ${GitHubCli.repo}. Rode \`gh auth login\` e confira se o repositório existe.`);
    }
    // GitHub does not create releases (or tags) in a repository with no commits.
    if (!GitHubCli.run(["api", `repos/${GitHubCli.repo}/commits?per_page=1`], true)) {
      throw new Error(`${GitHubCli.repo} está vazio. Crie um primeiro commit (ex.: "Add a README" na página do repositório).`);
    }
  },

  /** Uploads the binary to the `v<version>` release, creating it if it does not exist yet. */
  upload(version: string, filePath: string, notes: string | null) {
    const tag = ReleaseAssets.tag(version);

    const exists = GitHubCli.run(["release", "view", tag, ...repoArgs()], true);
    const created =
      exists || GitHubCli.run(["release", "create", tag, "--title", `LiveChurch ${tag}`, "--notes", notes ?? "", ...repoArgs()]);
    if (!created) throw new Error(`Falha ao criar o release ${tag} em ${GitHubCli.repo}.`);

    if (!GitHubCli.run(["release", "upload", tag, filePath, "--clobber", ...repoArgs()])) {
      throw new Error(`Falha ao enviar ${path.basename(filePath)} para ${tag}.`);
    }
  },
};
