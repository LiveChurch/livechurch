import { TemplateUtils } from "@/core/utils/TemplateUtils";

export type MessageNode = string | MessageNode[] | { [key: string]: MessageNode };
export type MessageTree = { [key: string]: MessageNode };

export interface Translator {
  /** Text of the key (`hero.title`), with `{name}` replaced by the parameters; without the key, returns the key itself. */
  t: (key: string, params?: Record<string, string>) => string;
  /** Raw value of the key (list or object), like vue-i18n's `tm`. */
  tm: <T>(key: string) => T;
}

function findNode(tree: MessageTree, key: string): MessageNode | undefined {
  let node: MessageNode | undefined = tree;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || Array.isArray(node)) return undefined;
    node = node[part];
  }
  return node;
}

export const Translators = {
  create(tree: MessageTree): Translator {
    return {
      t(key, params = {}) {
        const node = findNode(tree, key);
        if (typeof node !== "string") {
          console.error(`Tradução ausente: ${key}`);
          return key;
        }
        return TemplateUtils.fill(node, params);
      },
      tm<T>(key: string) {
        return findNode(tree, key) as T;
      },
    };
  },
};
