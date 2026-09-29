import type { BibleBook, Slide } from "@/core/types/playlist";
import { StringUtils } from "@/core/utils/StringUtils";

export const BibleSlides = {
  buildVerseId(book: string, chapter: number, verse: number) {
    return `biblia-${StringUtils.slugify(book)}-${chapter}-${verse}`;
  },

  getBook(bibleData: BibleBook[] | null, bookIndex: number): BibleBook | null {
    return bibleData?.[bookIndex] ?? null;
  },

  chapterSlides(
    book: BibleBook,
    bookName: string,
    chapterNumber: number,
  ): Slide[] {
    const verses = book.chapters[chapterNumber - 1];
    if (!verses) return [];
    return verses.map((verse, index) => ({
      title: `${bookName} ${chapterNumber}:${index + 1}`,
      text: `${index + 1}. ${verse}`,
    }));
  },
};
