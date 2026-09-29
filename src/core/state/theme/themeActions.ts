import type {
  DefaultThemeCategory,
  SlideBackground,
  SlidesTheme,
  ThemeBinding,
} from "@/core/types/theme";
import { ThemeCategories } from "./themeCategories";
import { normalizeTheme } from "./themeNormalization";
import { ThemePersistence } from "./themePersistence";

type ThemeState = {
  themes: SlidesTheme[];
  selectedThemeId: string;
  defaultThemeIds: Record<DefaultThemeCategory, string | null>;
  customBackgrounds: SlideBackground[];
  currentTheme: SlidesTheme;
  availableBackgrounds: SlideBackground[];
  getThemeById(themeId?: string | null): SlidesTheme | undefined;
};

export function createThemeManagementActions(state: ThemeState) {
  const management = {
    removeTheme(themeId: string) {
      if (state.themes.length <= 1) return false;

      const targetIndex = state.themes.findIndex((t) => t.id === themeId);
      if (targetIndex === -1) return false;

      state.themes = state.themes.filter((theme) => theme.id !== themeId);

      if (state.selectedThemeId === themeId) {
        const fallback =
          state.themes[Math.max(0, targetIndex - 1)] ?? state.themes[0];
        state.selectedThemeId = fallback?.id ?? "";
      }

      const categories = Object.keys(state.defaultThemeIds) as DefaultThemeCategory[];
      for (const category of categories) {
        if (state.defaultThemeIds[category] === themeId) {
          state.defaultThemeIds[category] = null;
        }
      }
      return true;
    },

    setDefaultThemeId(category: DefaultThemeCategory, themeId: string | null) {
      if (themeId === null) {
        state.defaultThemeIds[category] = null;
        return;
      }
      const theme = state.getThemeById(themeId);
      if (!theme || !ThemeCategories.appliesTo(theme, category)) return;
      state.defaultThemeIds[category] = themeId;
    },

    setDefaultThemeIds(ids: Record<DefaultThemeCategory, string | null>) {
      const categories = Object.keys(ids) as DefaultThemeCategory[];
      for (const category of categories) {
        management.setDefaultThemeId(category, ids[category]);
      }
    },

    /** Saves the edits of an existing theme without switching the selected theme. */
    updateTheme(theme: SlidesTheme) {
      const index = state.themes.findIndex((t) => t.id === theme.id);
      if (index === -1) return;

      const normalized = normalizeTheme(theme, theme.id);
      state.themes[index] = normalized;

      const categories = Object.keys(state.defaultThemeIds) as DefaultThemeCategory[];
      for (const category of categories) {
        const isDefault = state.defaultThemeIds[category] === normalized.id;
        if (isDefault && !ThemeCategories.appliesTo(normalized, category)) {
          state.defaultThemeIds[category] = null;
        }
      }
    },

    upsertTheme(theme: SlidesTheme) {
      const normalized = normalizeTheme(theme, theme.id);
      const index = state.themes.findIndex((t) => t.id === theme.id);
      if (index >= 0) {
        state.themes[index] = normalized;
      } else {
        state.themes.push(normalized);
      }
      state.selectedThemeId = normalized.id;
    },

    resolveThemeBinding(
      binding?: ThemeBinding | null,
      fallbackThemeId?: string,
    ): SlidesTheme {
      const fallback = state.getThemeById(fallbackThemeId) ?? state.currentTheme;
      if (!binding) return fallback;
      if (binding.mode === "custom") return binding.theme;
      return state.getThemeById(binding.themeId) ?? fallback;
    },

    /** Category's default theme (set in Global Themes) or, without one, a randomly drawn theme. */
    resolveDefaultBinding(category?: DefaultThemeCategory): ThemeBinding | null {
      const themeId = category ? state.defaultThemeIds[category] : null;
      return themeId
        ? { mode: "global", themeId }
        : management.createRandomBinding(undefined, category);
    },

    /**
     * Draws a global theme from the category, avoiding `excludeThemeId` when there is
     * an alternative.
     */
    createRandomBinding(
      excludeThemeId?: string,
      category?: DefaultThemeCategory,
    ): ThemeBinding | null {
      const eligible = state.themes.filter((theme) =>
        ThemeCategories.appliesTo(theme, category),
      );
      const alternatives = eligible.filter((theme) => theme.id !== excludeThemeId);
      const pool = [alternatives, eligible, state.themes].find(
        (candidates) => candidates.length > 0,
      );
      if (!pool) return null;
      const theme = pool[Math.floor(Math.random() * pool.length)];
      return { mode: "random", themeId: theme.id };
    },

    registerCustomBackground(name: string, backgroundImage: string) {
      const background: SlideBackground = {
        id: `custom-${Date.now()}`,
        name,
        backgroundImage,
        description: name,
      };
      state.customBackgrounds.push(background);
      ThemePersistence.saveCustomBackgrounds(state.customBackgrounds);
      return background;
    },

    addCustomBackground(name: string, backgroundImage: string) {
      const background = management.registerCustomBackground(
        name,
        backgroundImage,
      );
      state.currentTheme.backgroundId = background.id;
      state.currentTheme.backgroundUrl = background.backgroundImage;
    },

    removeCustomBackground(id: string) {
      state.customBackgrounds = state.customBackgrounds.filter(
        (bg) => bg.id !== id,
      );
      ThemePersistence.saveCustomBackgrounds(state.customBackgrounds);
    },
  };

  return management;
}
