import { computed, type Ref } from "vue";
import { BibleVersions } from "@/core/data/bibleVersions";
import { HarpaService, type HarpaHymn } from "@/core/services/HarpaService";
import { useLanguageStore } from "@/core/state/language/languageStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { BibleBooks } from "@/core/utils/BibleBooks";
import { BibleReferenceUtils } from "@/core/utils/BibleReferenceUtils";
import { I18n } from "@/core/i18n/I18n";

const HARPA_NUMBER_PATTERN = /^\d{1,4}$/;
const HARPA_MIN_TEXT_LENGTH = 3;

export type ShortcutTarget =
  | { kind: "bible"; label: string; preview: string; bookName: string; chapter: number; verse: number }
  | { kind: "harpa"; label: string; preview: string; hymn: HarpaHymn };

function findHymn(text: string): HarpaHymn | null {
  if (HARPA_NUMBER_PATTERN.test(text)) return HarpaService.findById(text);
  if (text.length < HARPA_MIN_TEXT_LENGTH) return null;
  return HarpaService.findByText(text, 1)[0] ?? null;
}

/**
 * Interprets what was typed in the quick shortcut: Bible reference ("jo 3 16"),
 * Harpa number ("15") or part of a hymn's title/lyrics.
 */
export function useShortcutTarget(text: Ref<string | null>) {
  const { state } = usePlaylistStore();
  const languageState = useLanguageStore().state;

  const typed = computed(() => (text.value ?? "").trim());
  const reference = computed(() => BibleReferenceUtils.parse(typed.value));

  const bibleTarget = computed<ShortcutTarget | null>(() => {
    const parsed = reference.value;
    const book = parsed ? BibleVersions.books(state.bibleVersionId)?.[parsed.bookIndex] : null;
    if (!parsed || !book) return null;

    const chapter = parsed.chapter ?? 1;
    const verse = parsed.verse ?? 1;
    const preview = book.chapters[chapter - 1]?.[verse - 1];
    if (preview === undefined) return null;

    const bookName = BibleBooks.name(parsed.bookIndex);
    return { kind: "bible", label: `${bookName} ${chapter}:${verse}`, preview, bookName, chapter, verse };
  });

  const harpaTarget = computed<ShortcutTarget | null>(() => {
    if (!languageState.supportsHarpa) return null;
    if (reference.value && !HARPA_NUMBER_PATTERN.test(typed.value)) return null;
    const hymn = findHymn(typed.value);
    if (!hymn) return null;
    return { kind: "harpa", label: `Harpa ${hymn.number} · ${hymn.title}`, preview: hymn.slides[0], hymn };
  });

  const target = computed(() => bibleTarget.value ?? harpaTarget.value);
  const typeHintKey = computed(() =>
    languageState.supportsHarpa ? "typeHint" : "typeHintBibleOnly",
  );
  const hint = computed(() =>
    reference.value
      ? I18n.t("control.bibleShortcut.invalidReference")
      : I18n.t(`control.bibleShortcut.${typeHintKey.value}`),
  );

  return { target, hint };
}
