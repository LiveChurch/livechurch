export const StringUtils = {
  /** Removes accents and normalizes for comparison (NFD without diacritics, lowercase). */
  normalize(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  },

  /** Turns text into a slug: no accents, only letters/numbers separated by hyphens. */
  slugify(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  },

  /** File name without the extension ("photo.final.png" → "photo.final"). */
  removeExtension(fileName: string) {
    return fileName.replace(/\.[^./\\]+$/, "");
  },

  /** Removes parts in parentheses/brackets ("Yahweh (Live)" → "Yahweh"). */
  removeBrackets(value: string) {
    return value.replace(/\s*[([][^)\]]*[)\]]/g, "").trim();
  },

  /** First letter uppercase. */
  capitalize(value: string) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  },

  /** Splits text into stanzas/blocks separated by a blank line. */
  splitStanzas(text: string): string[] {
    return text
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  },

  /** Regroups all the text's lines into blocks of `size` lines, separated by a blank line. */
  regroupLines(text: string, size: number): string {
    const lines = StringUtils.toLines(text);
    const blocks: string[] = [];
    for (let i = 0; i < lines.length; i += size) {
      blocks.push(lines.slice(i, i + size).join("\n"));
    }
    return blocks.join("\n\n");
  },

  /** Splits text into clean lines (no empty lines). */
  toLines(text: string): string[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  },

  /** Shortcut for toLines (clean lines of a block). */
  splitLines(text: string): string[] {
    return StringUtils.toLines(text);
  },

  /** Groups lines into blocks of `size` lines (default: 4 lines per slide). */
  chunkLines(lines: string[], size = 4): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < lines.length; i += size) {
      chunks.push(lines.slice(i, i + size).join("\n"));
    }
    return chunks;
  },
};
