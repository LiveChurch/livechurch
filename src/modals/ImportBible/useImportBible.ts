import { computed, reactive, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { BibleFileParser } from "@/core/data/BibleFileParser";
import { BibleVersions } from "@/core/data/bibleVersions";
import type { AppLocale } from "@/core/i18n/AppLocale";
import { useLanguageStore } from "@/core/state/language/languageStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { BibleBook } from "@/core/types/playlist";

/** Import form: reads and validates the chosen JSON and stores the Bible in the local database. */
export function useImportBible(onSaved: () => void) {
  const { t } = useI18n();
  const language = useLanguageStore();
  const playlist = usePlaylistStore();

  const form = reactive({ name: "", tag: "", locale: language.state.locale as AppLocale });
  // shallowRef: the text (~4 MB) cannot become a Proxy, otherwise IndexedDB cannot write it.
  const books = shallowRef<BibleBook[] | null>(null);
  const fileName = ref("");
  const errorMessage = ref("");

  const canSave = computed(
    () => books.value !== null && form.name.trim() !== "" && form.tag.trim() !== "",
  );

  const selectFile = async (file: File) => {
    fileName.value = file.name;
    errorMessage.value = "";
    books.value = null;
    try {
      books.value = BibleFileParser.parse(await file.text());
      if (!form.name) form.name = file.name.replace(/\.json$/i, "");
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : String(error);
    }
  };

  const save = async () => {
    if (!canSave.value || !books.value) return;
    try {
      const version = await BibleVersions.addCustom(
        {
          name: form.name.trim(),
          tag: form.tag.trim().toUpperCase(),
          locale: form.locale,
          description: t("modals.importBible.description"),
        },
        books.value,
      );
      playlist.actions.setBibleVersion(version.id);
      onSaved();
    } catch (error) {
      console.error("Falha ao salvar a Bíblia importada", error);
      errorMessage.value = t("modals.importBible.errors.saveFailed");
    }
  };

  return { form, books, fileName, errorMessage, canSave, selectFile, save };
}
