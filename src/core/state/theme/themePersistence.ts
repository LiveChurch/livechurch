import { StorageService } from "@/core/services/StorageService";
import type {
  DefaultThemeCategory,
  SlideBackground,
  SlidesTheme,
} from "@/core/types/theme";
import { createFallbackTheme, normalizeTheme } from "./themeNormalization";

interface PersistedThemes {
  themes: SlidesTheme[];
  selectedThemeId: string;
  defaultThemeIds?: Record<DefaultThemeCategory, string | null>;
}

export const ThemePersistence = {
  /** Reads the saved themes, normalizing fields and resolving backgrounds by id. */
  loadThemes(
    backgrounds: SlideBackground[],
  ): { themes: SlidesTheme[]; selectedThemeId: string } {
    const stored = StorageService.readJson<Partial<PersistedThemes>>(
      StorageService.keys.themes,
      {},
    );

    const themes = (stored.themes ?? []).map((theme) => {
      const normalized = normalizeTheme(theme, theme.id);
      if (!normalized.backgroundUrl && normalized.backgroundId) {
        const background = backgrounds.find((bg) => bg.id === normalized.backgroundId);
        if (background) normalized.backgroundUrl = background.backgroundImage;
      }
      return normalized;
    });

    return {
      themes,
      selectedThemeId: stored.selectedThemeId || "theme-default",
    };
  },

  loadDefaultThemeIds(
    stored: PersistedThemes["defaultThemeIds"],
  ): Record<DefaultThemeCategory, string | null> {
    return {
      bible: null,
      harpa: null,
      hymns: null,
      events: null,
      ...stored,
    };
  },

  save(snapshot: PersistedThemes) {
    StorageService.writeJson(StorageService.keys.themes, snapshot);
  },

  loadCustomBackgrounds(): SlideBackground[] {
    return StorageService.readJson<SlideBackground[]>(
      StorageService.keys.customBackgrounds,
      [],
    );
  },

  saveCustomBackgrounds(backgrounds: SlideBackground[]) {
    StorageService.writeJson(StorageService.keys.customBackgrounds, backgrounds);
  },

  fallbackTheme(fontFamily: string): SlidesTheme {
    return createFallbackTheme(fontFamily);
  },
};
