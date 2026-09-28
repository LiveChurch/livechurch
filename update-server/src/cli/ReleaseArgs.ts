export type CliCommand = "version" | "asar" | "exe" | "publish" | "all" | "keys";

export interface CliArgs {
  command: CliCommand;
  /** `patch`, `minor`, `major`, `current` (keeps the current one) or an explicit `x.y.z` version. */
  versionSpec: string;
  notes: string | null;
  force: boolean;
  /** The manifest points to the installer instead of the `.asar` (use when Electron changes). */
  full: boolean;
  /** Required system (`win32`, `linux`): the bytecode and the installer are only generated on the system itself. */
  platform: string | null;
}

export const USAGE = `Uso (da raiz do app):
  bun run release:version [patch|minor|major|current|x.y.z]   cria a versão (padrão: patch)
  bun run release:asar                                        gera o .asar da versão atual
  bun run release:exe:win | release:exe:linux                 gera o executável da versão atual
  bun run release:publish [--full] [--notes "texto"]          sobe o .asar, o executável e o manifesto
  bun run release:win | release:linux [versão] [--full] [--notes "texto"]   tudo acima em sequência
  bun run --cwd update-server keys [--force]                  gera o par de chaves que assina os releases`;

const COMMANDS: readonly CliCommand[] = ["version", "asar", "exe", "publish", "all", "keys"];
const FLAGS_WITH_VALUE = ["--notes", "--platform"];

function isCommand(value: string | undefined): value is CliCommand {
  return COMMANDS.some((command) => command === value);
}

/** Value of `--flag value`, or null if the flag was not passed. */
function flagValue(args: string[], flag: string): string | null {
  const index = args.indexOf(flag);
  if (index < 0) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${flag} precisa de um valor.`);
  return value;
}

export const ReleaseArgs = {
  parse(argv: string[]): CliArgs {
    const [command, ...rest] = argv;
    if (!isCommand(command)) throw new Error("Comando inválido.");

    const flagValues = new Set(FLAGS_WITH_VALUE.map((flag) => rest.indexOf(flag) + 1).filter((index) => index > 0));
    const positional = rest.filter((arg, index) => !arg.startsWith("--") && !flagValues.has(index));

    return {
      command,
      versionSpec: positional[0] ?? "patch",
      notes: flagValue(rest, "--notes"),
      force: rest.includes("--force"),
      full: rest.includes("--full"),
      platform: flagValue(rest, "--platform"),
    };
  },
};
