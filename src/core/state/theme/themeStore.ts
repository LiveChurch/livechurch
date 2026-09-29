import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { SLIDE_BACKGROUNDS } from "@/core/constants/slideBackgrounds";
import { StorageService } from "@/core/services/StorageService";
import type {
  DefaultThemeCategory,
  SlideBackground,
  SlidesTheme,
  UiTheme,
} from "@/core/types/theme";
import { createThemeManagementActions } from "./themeActions";
import { ThemePersistence } from "./themePersistence";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";

const FONT_OPTIONS = [
  "Poppins",
  "Merriweather",
  "Playfair Display",
  "Cinzel",
  "Bodoni Moda",
  "Crimson Text",
  "Oswald",
  "Georgia",
];

function readStoredUiTheme(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(StorageService.keys.uiTheme);
}

function applyUiTheme(theme: UiTheme) {
  StorageService.setClassNameFlag("dark-mode", theme === "dark");
  StorageService.setClassNameFlag("light-mode", theme === "light");
}

/**
 * Theme store (replaces MobX's ThemeStore + React's ThemeContext).
 * Keeps the `{ state, actions }` API to ease porting.
 */
export const useThemeStore = defineStore("theme", () => {
  const storedSnapshot = ThemePersistence.loadThemes(SLIDE_BACKGROUNDS);

  const state = reactive({
    uiTheme: "dark" as UiTheme,
    customBackgrounds: ThemePersistence.loadCustomBackgrounds(),
    fontOptions: FONT_OPTIONS,
    themes: storedSnapshot.themes,
    selectedThemeId: storedSnapshot.selectedThemeId,
    defaultThemeIds: ThemePersistence.loadDefaultThemeIds(
      (
        StorageService.readJson<{
          defaultThemeIds?: Record<DefaultThemeCategory, string | null>;
        }>(StorageService.keys.themes, {})
      ).defaultThemeIds,
    ),

    get availableBackgrounds(): SlideBackground[] {
      return [...SLIDE_BACKGROUNDS, ...this.customBackgrounds];
    },

    get currentTheme(): SlidesTheme {
      return (
        this.themes.find((theme) => theme.id === this.selectedThemeId) ??
        this.themes[0]
      );
    },

    getThemeById(themeId?: string | null): SlidesTheme | undefined {
      if (!themeId) return undefined;
      return this.themes.find((theme) => theme.id === themeId);
    },
  });

  if (state.themes.length === 0) {
    state.themes = [ThemePersistence.fallbackTheme(FONT_OPTIONS[0])];
    state.selectedThemeId = "theme-default";
  }

  const actions = {
    setUiTheme(theme: UiTheme) {
      state.uiTheme = theme;
      localStorage.setItem(StorageService.keys.uiTheme, theme);
      applyUiTheme(theme);
    },

    toggleUiTheme() {
      actions.setUiTheme(state.uiTheme === "dark" ? "light" : "dark");
    },

    setSelectedThemeId(themeId: string) {
      if (!state.themes.some((theme) => theme.id === themeId)) return;
      state.selectedThemeId = themeId;
    },

    createTheme(name?: string, baseThemeId?: string) {
      const baseTheme = state.getThemeById(baseThemeId) ?? state.currentTheme;
      const nextThemeId = `theme-${Date.now()}`;
      const nextTheme = {
        ...baseTheme,
        id: nextThemeId,
        name: name || `Tema ${state.themes.length + 1}`,
      };
      actions.upsertTheme(nextTheme);
      return nextTheme;
    },

    persist() {
      ThemePersistence.save({
        themes: state.themes,
        selectedThemeId: state.selectedThemeId,
        defaultThemeIds: state.defaultThemeIds,
      });
    },

    ...createThemeManagementActions(state),
  };

  const storedUiTheme = readStoredUiTheme();
  if (storedUiTheme === "light" || storedUiTheme === "dark") {
    state.uiTheme = storedUiTheme;
  }
  applyUiTheme(state.uiTheme);

  // Replaces the persistence `reaction` that existed in ThemeContext. Debounced
  // so it does not rewrite all the themes on every reactive change.
  const debouncedPersist = PersistenceUtils.debouncePersist(() =>
    actions.persist(),
  );
  watch(
    () => [state.themes, state.selectedThemeId, state.defaultThemeIds],
    () => debouncedPersist(),
    { deep: true },
  );

  return { state, actions };
});
