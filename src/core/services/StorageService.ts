const STORAGE_KEYS = {
  uiTheme: "uiTheme",
  themes: "themes",
  customBackgrounds: "customBackgrounds",
  calendarEvents: "calendar_events",
  broadcastStyle: "broadcastStyle",
  watermarkSettings: "watermarkSettings",
  locale: "locale",
} as const;

export const StorageService = {
  keys: STORAGE_KEYS,

  readJson<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`Falha ao ler "${key}" do localStorage`, error);
      return fallback;
    }
  },

  writeJson(key: string, value: unknown) {
    if (typeof window === "undefined") return;
    console.log(`Gravando "${key}" no localStorage`, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Falha ao gravar "${key}" no localStorage`, error);
    }
  },

  setClassNameFlag(className: string, enabled: boolean) {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle(className, enabled);
  },
};
