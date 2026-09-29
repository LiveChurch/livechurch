/** Names in the releases repository. The app builds the manifest URL with the same rule (`UpdateApi`). */
export const ReleaseAssets = {
  tag: (version: string) => `v${version}`,

  /** Update for installed apps, e.g. `livechurch-code-0.0.7-win32-x64.asar`. */
  asarFileName: (version: string, platform: string) => `livechurch-code-${version}-${platform}.asar`,

  /** Instalador, ex.: `livechurch-setup-0.0.7-win32-x64.exe`. */
  setupFileName: (version: string, platform: string, extension: string) =>
    `livechurch-setup-${version}-${platform}${extension}`,

  /** Versioned manifest in the repository's `releases/` folder, e.g. `releases/win32-x64.json`. */
  manifestPath: (platform: string) => `releases/${platform}.json`,

  downloadUrl: (repo: string, version: string, name: string) =>
    `https://github.com/${repo}/releases/download/${ReleaseAssets.tag(version)}/${encodeURIComponent(name)}`,
};
