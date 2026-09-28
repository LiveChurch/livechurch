import { BibleVersions } from "@/core/data/bibleVersions";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { BibleBook } from "@/core/types/playlist";

/** Books of the selected version, or null while the text is still being downloaded. */
function currentBooks(): BibleBook[] | null {
  return BibleVersions.books(usePlaylistStore().state.bibleVersionId);
}

/** The JSON brings the abbreviations in lowercase ("1sm"); the display capitalizes the first letter. */
function capitalizeAbbreviation(abbreviation: string): string {
  return abbreviation.replace(/\p{L}/u, (letter) => letter.toUpperCase());
}

/**
 * Book names and abbreviations come from the selected version's JSON (its own language and names).
 * While the JSON has not loaded, the lists stay empty. The book saved in the items is its name
 * in that version.
 */
export const BibleBooks = {
  /** Number of Old Testament books; the rest are from the New. */
  oldTestamentCount: 39,

  count(): number {
    return currentBooks()?.length ?? 0;
  },

  name(bookIndex: number): string {
    return currentBooks()?.[bookIndex]?.name ?? "";
  },

  abbreviation(bookIndex: number): string {
    const abbreviation = currentBooks()?.[bookIndex]?.abbrev;
    return abbreviation ? capitalizeAbbreviation(abbreviation) : "";
  },

  /** Position of the book in the selected version, or -1 if it has no book with that name. */
  indexOf(name?: string): number {
    if (!name) return -1;
    return BibleBooks.names().indexOf(name);
  },

  names(): readonly string[] {
    return currentBooks()?.map((book) => book.name) ?? [];
  },

  abbreviations(): readonly string[] {
    return currentBooks()?.map((book) => book.abbrev) ?? [];
  },
};
