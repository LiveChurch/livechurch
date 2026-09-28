import { watch } from "vue";
import { BibleVersions } from "@/core/data/bibleVersions";
import { useLanguageStore } from "@/core/state/language/languageStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";

/**
 * Keeps the active Bible version in the interface language: when the language changes, or when
 * the saved version is in another language, suggests the current language's version (if there is one).
 */
export function useSuggestBibleVersion() {
  const language = useLanguageStore();
  const playlist = usePlaylistStore();

  watch(
    () => [language.state.locale, playlist.state.isHydrated] as const,
    ([locale, isHydrated]) => {
      if (!isHydrated || playlist.state.activeBibleVersion.locale === locale) return;
      const suggested = BibleVersions.defaultFor(locale);
      if (suggested) playlist.actions.setBibleVersion(suggested.id);
    },
    { immediate: true },
  );
}
