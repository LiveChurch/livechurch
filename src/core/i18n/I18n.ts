import { createI18n } from "vue-i18n";
import { DEFAULT_LOCALE, Locales, type AppLocale } from "./AppLocale";
import { messages } from "./locales";
import { StorageService } from "@/core/services/StorageService";

type LocaleMessages = Record<string, string>;

function readInitialLocale(): AppLocale {
  const stored = localStorage.getItem(StorageService.keys.locale);
  if (Locales.isSupported(stored)) return stored;
  return Locales.fromSystem(navigator.language);
}

export const i18n = createI18n({
  legacy: false,
  locale: readInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  missingWarn: false,
  fallbackWarn: false,
  messages: messages as Record<string, LocaleMessages>,
});

type Translate = (key: string, params?: Record<string, unknown>) => string;

/** Translation outside components (core/, services). Resolves the language at call time. */
export const I18n = {
  t: i18n.global.t as Translate,
  get locale() {
    return i18n.global.locale.value as AppLocale;
  },
  setLocale(locale: AppLocale) {
    i18n.global.locale.value = locale;
  },
};
