import { PLATFORMS } from "@/core/constants/Platforms";
import { SiteConfig } from "@/core/constants/SiteConfig";
import type { InstallerRelease } from "@/core/types/release";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  draft: boolean;
  assets: GitHubAsset[];
}

const RELEASES_PER_PAGE = 30;

function toInstallerRelease(release: GitHubRelease): InstallerRelease {
  const installers: InstallerRelease["installers"] = {};
  for (const platform of PLATFORMS) {
    const asset = release.assets.find((item) => item.name.toLowerCase().endsWith(platform.installerExtension));
    if (asset) installers[platform.id] = { name: asset.name, url: asset.browser_download_url };
  }
  return { version: release.tag_name.replace(/^v/, ""), installers };
}

export const GitHubReleaseService = {
  /** Published versions (most recent to oldest) that have at least one installer. */
  async listInstallerReleases(signal?: AbortSignal): Promise<InstallerRelease[]> {
    const response = await fetch(`${SiteConfig.releasesApi}?per_page=${RELEASES_PER_PAGE}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal,
    });
    if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);

    const releases = (await response.json()) as GitHubRelease[];
    return releases
      .filter((release) => !release.draft)
      .map(toInstallerRelease)
      .filter((release) => Object.keys(release.installers).length > 0);
  },
};
