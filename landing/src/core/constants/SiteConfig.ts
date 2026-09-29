const GITHUB_ORG = "LiveChurch";
const RELEASES_REPO = `${GITHUB_ORG}/livechurch`;

export const SiteConfig = {
  name: "LiveChurch",
  /** Path of the download page, within the language. */
  downloadPage: "/download",
  githubUrl: `https://github.com/${GITHUB_ORG}`,
  releasesApi: `https://api.github.com/repos/${RELEASES_REPO}/releases`,
  releasesPage: `https://github.com/${RELEASES_REPO}/releases`,
} as const;

export const NavLinks = [
  { key: "features", hash: "#features" },
  { key: "free", hash: "#free" },
  { key: "faq", hash: "#faq" },
] as const;
