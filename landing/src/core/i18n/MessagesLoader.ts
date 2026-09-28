import { readFileSync } from "node:fs";
import path from "node:path";
import { load } from "js-yaml";
import type { AppLocale } from "./AppLocale";
import type { MessageTree } from "./Translator";

const LOCALES_DIR = path.join(process.cwd(), "src", "core", "i18n", "locales");

/** Reads the language's YAML. Only runs on the server (build); the texts reach the browser via I18nProvider. */
export const MessagesLoader = {
  load(locale: AppLocale): MessageTree {
    return load(readFileSync(path.join(LOCALES_DIR, `${locale}.yaml`), "utf8")) as MessageTree;
  },
};
