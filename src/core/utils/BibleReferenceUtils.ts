import { BibleBooks } from "./BibleBooks";
import { StringUtils } from "./StringUtils";

export interface BibleReference {
  bookIndex: number;
  chapter: number | null;
  verse: number | null;
}

// "1 jo 3 16", "1jo3:16", "jo 3.16": book (with optional number), chapter and verse.
const REFERENCE_PATTERN = /^(\d?\s*[\p{L}]+)\s*(?:(\d+)(?:\s*[\s.:,]\s*(\d+)?)?)?$/u;

const compact = (value: string) => StringUtils.normalize(value).replace(/\s+/g, "");

function findBookIndex(token: string): number {
  const typed = token.toLowerCase().replace(/\s+/g, "");
  const normalized = compact(token);

  const abbreviations = BibleBooks.abbreviations();
  const names = BibleBooks.names();
  const candidates = [
    abbreviations.findIndex((abbreviation) => abbreviation.toLowerCase() === typed),
    abbreviations.findIndex((abbreviation) => compact(abbreviation) === normalized),
    names.findIndex((book) => compact(book).startsWith(normalized)),
  ];
  return candidates.find((index) => index !== -1) ?? -1;
}

export const BibleReferenceUtils = {
  /** Parses what was typed ("jo 3 16"); returns null if no book matches. */
  parse(text: string): BibleReference | null {
    const match = text.trim().match(REFERENCE_PATTERN);
    if (!match) return null;

    const bookIndex = findBookIndex(match[1]);
    if (bookIndex === -1) return null;

    return {
      bookIndex,
      chapter: match[2] ? Number(match[2]) : null,
      verse: match[3] ? Number(match[3]) : null,
    };
  },
};
