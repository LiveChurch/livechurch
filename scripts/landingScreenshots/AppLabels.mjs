import { readFileSync } from "node:fs";
import path from "node:path";
import { load } from "js-yaml";

const LOCALES_DIR = path.join(process.cwd(), "src", "core", "i18n", "locales");

/** Texts of the app's interface in one language, read from the same YAML the app uses, so the selectors follow the translations. */
export class AppLabels {
  constructor(locale) {
    this.locale = locale;
    this.tree = load(readFileSync(path.join(LOCALES_DIR, `${locale}.yaml`), "utf8"));
  }

  t(key) {
    const value = key.split(".").reduce((node, part) => node?.[part], this.tree);
    if (typeof value !== "string") throw new Error(`Label "${key}" not found in ${this.locale}.yaml`);
    return value;
  }
}
