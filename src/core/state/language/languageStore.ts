import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { I18n } from "@/core/i18n/I18n";
import { LOCALE_OPTIONS, type AppLocale } from "@/core/i18n/AppLocale";
import { StorageService } from "@/core/services/StorageService";

/** Interface language store. Keeps the `{ state, actions }` API of the other stores. */
export const useLanguageStore = defineStore("language", () => {
  const locale = ref<AppLocale>(I18n.locale);

  const state = reactive({
    locale,
    options: LOCALE_OPTIONS,
    /** Harpa Cristã exists only in Portuguese. */
    supportsHarpa: computed(() => locale.value === "pt-BR"),
  });

  const actions = {
    /** True until the user picks a language (or dismisses the first-run prompt). */
    needsSetup: () => localStorage.getItem(StorageService.keys.locale) === null,
    setLocale(next: AppLocale) {
      locale.value = next;
      I18n.setLocale(next);
      localStorage.setItem(StorageService.keys.locale, next);
      document.documentElement.lang = next;
    },
  };

  return { state, actions };
});
