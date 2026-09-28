import { ReleaseArgs, USAGE } from "./ReleaseArgs";
import { ReleaseCommands } from "./ReleaseCommands";

try {
  const args = ReleaseArgs.parse(process.argv.slice(2));
  await ReleaseCommands[args.command](args);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error(`\n${USAGE}`);
  process.exit(1);
}
