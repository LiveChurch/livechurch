export type AppLocale = "pt-BR" | "en" | "es";

export const DEFAULT_LOCALE: AppLocale = "pt-BR";

export const LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

export const Locales = {
  all: LOCALE_OPTIONS.map((option) => option.value),

  isSupported(value: string | null | undefined): value is AppLocale {
    return LOCALE_OPTIONS.some((option) => option.value === value);
  },

  /** First preferred browser language that the landing supports (e.g. "en-US" → "en"); with no match, the default. */
  fromBrowser(languages: readonly string[]): AppLocale {
    for (const language of languages) {
      const base = language.toLowerCase().split("-")[0];
      if (base === "en") return "en";
      if (base === "es") return "es";
      if (base === "pt") return "pt-BR";
    }
    return DEFAULT_LOCALE;
  },

  /** Swaps the language at the start of a path (`/pt-BR/download` → `/en/download`). */
  switchPath(pathname: string, locale: AppLocale): string {
    const [, current, ...rest] = pathname.split("/");
    const tail = Locales.isSupported(current) ? rest : [current, ...rest];
    return `/${[locale, ...tail].filter(Boolean).join("/")}`;
  },
};
