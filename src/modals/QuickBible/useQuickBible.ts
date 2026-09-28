import { computed, ref } from "vue";
import { BibleVersions } from "@/core/data/bibleVersions";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { BibleBooks } from "@/core/utils/BibleBooks";

/** Three-step selection (book, chapter, verse) of the quick Bible picker. */
export function useQuickBible(onSelected: () => void) {
  const { state, actions } = usePlaylistStore();

  const bookIndex = ref<number | null>(null);
  const chapter = ref<number | null>(null);

  const books = computed(() => BibleVersions.books(state.bibleVersionId));
  const book = computed(() =>
    bookIndex.value === null ? null : (books.value?.[bookIndex.value] ?? null),
  );
  const chapterCount = computed(() => book.value?.chapters.length ?? 0);
  const verseCount = computed(() => {
    if (!book.value || chapter.value === null) return 0;
    return book.value.chapters[chapter.value - 1]?.length ?? 0;
  });

  function selectBook(index: number) {
    bookIndex.value = index;
    const singleChapter = books.value?.[index]?.chapters.length === 1;
    chapter.value = singleChapter ? 1 : null;
  }

  function selectVerse(verse: number) {
    if (bookIndex.value === null || chapter.value === null) return;
    actions.openVerse(BibleBooks.name(bookIndex.value), chapter.value, verse);
    onSelected();
  }

  return {
    bookIndex,
    chapter,
    isLoading: computed(() => !books.value),
    chapterCount,
    verseCount,
    selectBook,
    selectChapter: (value: number) => (chapter.value = value),
    selectVerse,
  };
}
