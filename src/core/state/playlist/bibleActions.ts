import type { PlaylistItem } from "@/core/types/playlist";
import { BibleVersions } from "@/core/data/bibleVersions";
import { I18n } from "@/core/i18n/I18n";
import { BibleBooks } from "@/core/utils/BibleBooks";
import { BibleSlides } from "./BibleSlides";
import type { PlaylistState } from "./playlistTypes";

type PlaylistMutations = {
  addToPlaylist: (item: PlaylistItem) => void;
  setActiveItemId: (id: string | null) => void;
  setLiveItemId: (id: string) => void;
};

export function createBibleActions(
  state: PlaylistState,
  mutations: PlaylistMutations,
) {
  const bookData = (bookName?: string) => {
    const bookIndex = BibleBooks.indexOf(bookName);
    if (bookIndex === -1) return null;
    const book = BibleSlides.getBook(
      BibleVersions.books(state.bibleVersionId),
      bookIndex,
    );
    if (!book || !bookName) return null;
    return { book, bookName };
  };

  const actions = {
    setBibleVersion(versionId: string) {
      if (state.bibleVersionId === versionId) return;
      if (!state.bibleVersions.some((v) => v.id === versionId)) return;
      state.bibleVersionId = versionId;
    },

    goToPreviousChapter() {
      actions.navigateBibleChapter("prev");
    },

    goToNextChapter() {
      actions.navigateBibleChapter("next");
    },

    /**
     * Puts the verse in preview: reuses the item of the same chapter if it is already
     * in the playlist, otherwise adds a new one. Returns the item id.
     */
    openVerse(bookName: string, chapter: number, verse: number) {
      const existing = state.activePlaylist.items.find(
        (item) =>
          item.type === "bible-verse" &&
          item.bibleData?.book === bookName &&
          item.bibleData.chapter === String(chapter),
      );
      if (existing?.bibleData) {
        existing.bibleData.verse = String(verse);
        mutations.setActiveItemId(existing.id);
        return existing.id;
      }

      const id = BibleSlides.buildVerseId(bookName, chapter, verse);
      mutations.addToPlaylist({
        id,
        name: `${bookName} ${chapter}`,
        subtitle: I18n.t("common.terms.bible"),
        type: "bible-verse",
        slides: [],
        activeSlideIndex: verse - 1,
        bibleData: {
          book: bookName,
          chapter: String(chapter),
          verse: String(verse),
        },
      });
      mutations.setActiveItemId(id);
      return id;
    },

    navigateBibleChapter(direction: "prev" | "next") {
      const item = state.activeItem;
      if (!item || item.type !== "bible-verse") return;

      const currentChapter = parseInt(item.bibleData?.chapter || "0");
      const data = bookData(item.bibleData?.book);
      if (!data || !currentChapter) return;

      const totalChapters = data.book.chapters.length;
      if (direction === "prev" && currentChapter <= 1) return;
      if (direction === "next" && currentChapter >= totalChapters) return;

      const targetChapter =
        direction === "prev" ? currentChapter - 1 : currentChapter + 1;
      const verses = data.book.chapters[targetChapter - 1];
      if (!verses || verses.length === 0) return;

      const targetVerse = direction === "prev" ? verses.length : 1;
      const id = actions.openVerse(data.bookName, targetChapter, targetVerse);
      mutations.setLiveItemId(id);
    },
  };

  return actions;
}
