import { I18n } from "../i18n/I18n";
import type { BibleBook } from "../types/playlist";

/** The app locates books by position, so the file must have all 66 in canonical order. */
export const BIBLE_BOOK_COUNT = 66;

function fail(key: string, params?: Record<string, unknown>): never {
  throw new Error(I18n.t(`modals.importBible.errors.${key}`, params));
}

function isTextList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((verse) => typeof verse === "string");
}

function parseBook(raw: unknown, index: number): BibleBook {
  const book = raw as Partial<BibleBook> | null;
  const position = index + 1;
  if (typeof book?.name !== "string" || book.name.trim() === "") fail("bookName", { position });
  if (typeof book.abbrev !== "string" || book.abbrev.trim() === "") fail("bookAbbrev", { position });
  const { chapters } = book;
  if (!Array.isArray(chapters) || chapters.length === 0 || !chapters.every(isTextList)) {
    fail("bookChapters", { position, name: book.name });
  }
  return { abbrev: book.abbrev.trim(), name: book.name.trim(), chapters };
}

export const BibleFileParser = {
  /** Validates the JSON `[{ abbrev, name, chapters: string[][] }]` (66 books). Throws an already translated error. */
  parse(text: string): BibleBook[] {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      fail("invalidJson");
    }
    if (!Array.isArray(data)) fail("notList");
    if (data.length !== BIBLE_BOOK_COUNT) fail("bookCount", { expected: BIBLE_BOOK_COUNT, found: data.length });
    return data.map(parseBook);
  },
};
