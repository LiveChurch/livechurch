export type AppLocale = "pt-BR" | "en" | "es";

export const DEFAULT_LOCALE: AppLocale = "pt-BR";

export const LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

/** Whisper transcription language for each interface language. */
const WHISPER_LANGUAGES: Record<AppLocale, string> = {
  "pt-BR": "portuguese",
  en: "english",
  es: "spanish",
};

export const Locales = {
  whisperLanguage: (locale: AppLocale) => WHISPER_LANGUAGES[locale],

  isSupported(value: string | null | undefined): value is AppLocale {
    return LOCALE_OPTIONS.some((option) => option.value === value);
  },

  /** Converts the system language (e.g. "en-US", "es-MX") into a supported language. */
  fromSystem(systemLanguage: string): AppLocale {
    const base = systemLanguage.toLowerCase().split("-")[0];
    if (base === "en") return "en";
    if (base === "es") return "es";
    return DEFAULT_LOCALE;
  },
};
