import fs from "node:fs";
import { AppVersion } from "./AppVersion";
import { KeyPair } from "./KeyPair";
import type { CliArgs } from "./ReleaseArgs";
import { ReleasePublisher } from "./ReleasePublisher";
import { BundleAssembler, type BundleInfo } from "./build/BundleAssembler";
import { InstallerBuild } from "./build/InstallerBuild";
import { GitHubRelease } from "./github/GitHubRelease";

const PLATFORM_NAMES: Record<string, string> = { win32: "Windows", linux: "Linux", darwin: "macOS" };
const platformName = (platform: string) => PLATFORM_NAMES[platform] ?? platform;

/** The bytecode and the installer are per system: the Windows executable can only be built on a Windows machine. */
function assertPlatform(platform: string | null) {
  if (platform && platform !== process.platform) {
    throw new Error(
      `Este comando é para ${platformName(platform)}; rode numa máquina ${platformName(platform)} ` +
        `(esta é ${platformName(process.platform)}).`,
    );
  }
}

/** Version bundle: reuses the one from the `.asar` step, so the executable carries the same code. */
async function bundleFor(version: string): Promise<BundleInfo> {
  const info = BundleAssembler.readInfo();
  if (info?.version === version) return info;
  return BundleAssembler.assemble(version);
}

export const ReleaseCommands = {
  keys(args: CliArgs) {
    KeyPair.generate(args.force);
    console.log("Chaves geradas. Recompile o app para embutir a nova chave pública.");
  },

  /** Creates the version in the app's `package.json`. */
  version(args: CliArgs) {
    const { previous, next } = AppVersion.bump(args.versionSpec);
    console.log(`Versão ${previous} → ${next}`);
  },

  /** Builds the current version's bundle (renderer, main as bytecode, preload) and packages it into an `.asar`. */
  async asar() {
    KeyPair.assertMatchesApp();
    const version = AppVersion.read();

    await BundleAssembler.assemble(version);
    console.log(`.asar (v${version}): ${await BundleAssembler.pack(version)}`);
  },

  /** Generates the installer executable of the current version for this system. */
  async exe(args: CliArgs) {
    assertPlatform(args.platform);
    KeyPair.assertMatchesApp();
    const version = AppVersion.read();

    await bundleFor(version);
    console.log(`Executável (v${version}): ${InstallerBuild.build(version)}`);
  },

  /** Uploads to GitHub what was generated for the current version (installer, `.asar`) and, lastly, the manifest. */
  publish(args: CliArgs) {
    KeyPair.assertMatchesApp();
    GitHubRelease.assertReady();
    const version = AppVersion.read();

    const bundle = BundleAssembler.readInfo();
    if (bundle?.version !== version) throw new Error(`Gere o .asar ou o executável da versão ${version} antes de publicar.`);

    const asarPath = BundleAssembler.archivePath(version);
    const manifest = ReleasePublisher.publish({
      version,
      electronVersion: bundle.electronVersion,
      asarPath: fs.existsSync(asarPath) ? asarPath : null,
      installerPath: InstallerBuild.find(version),
      full: args.full,
      notes: args.notes,
    });
    console.log(`Manifesto ${manifest.platform}.json (${manifest.type}) → ${manifest.bundleUrl}`);
  },

  /** Everything for this system: creates the version, generates `.asar` and executable and uploads. If it fails, the version is rolled back. */
  async all(args: CliArgs) {
    assertPlatform(args.platform);
    KeyPair.assertMatchesApp();
    GitHubRelease.assertReady();

    const previous = AppVersion.read();
    ReleaseCommands.version(args);
    try {
      await ReleaseCommands.asar();
      await ReleaseCommands.exe(args);
      ReleaseCommands.publish(args);
    } catch (error) {
      AppVersion.write(previous);
      throw error;
    }
  },
};
