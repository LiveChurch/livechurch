import { inject, provide, toValue, type InjectionKey, type MaybeRefOrGetter } from "vue";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { SlideBackground, SlidesTheme } from "@/core/types/theme";

/**
 * Equivalent to ThemeEditorContext (React) via provide/inject.
 * Replaces `ThemeEditorProvider` + `useContext` with
 * `useThemeEditorProvide()` (in the ancestor) and `useThemeEditor()` (in the descendants).
 */
export interface ThemeEditorValue {
  currentTheme: SlidesTheme;
  availableBackgrounds: SlideBackground[];
  fontOptions: string[];
  addCustomBackground: (name: string, backgroundImage: string) => void;
  removeCustomBackground: (id: string) => void;
}

const ThemeEditorKey: InjectionKey<ThemeEditorValue> = Symbol("ThemeEditor");

/**
 * Must be called once in the setup of an ancestor component
 * (here, ThemeSectionContent.vue). `currentTheme` accepts a ref/getter to
 * survive object replacements in the store (e.g. upsertTheme).
 */
export function useThemeEditorProvide(currentTheme: MaybeRefOrGetter<SlidesTheme>) {
  const themeCtx = useThemeStore();

  const value: ThemeEditorValue = {
    // Getters preserve reactivity when accessing the Pinia state and the
    // most recent current theme (mirrors the value recreated on every render in React).
    get currentTheme() {
      return toValue(currentTheme);
    },
    get availableBackgrounds() {
      return themeCtx.state.availableBackgrounds;
    },
    get fontOptions() {
      return themeCtx.state.fontOptions;
    },
    addCustomBackground(name: string, backgroundImage: string) {
      const background = themeCtx.actions.registerCustomBackground(name, backgroundImage);
      const theme = toValue(currentTheme);
      theme.backgroundId = background.id;
      theme.backgroundUrl = background.backgroundImage;
      if (theme.rotateBackgrounds) {
        theme.backgroundIds = [...(theme.backgroundIds ?? []), background.id];
      }
    },
    removeCustomBackground(id: string) {
      themeCtx.actions.removeCustomBackground(id);
    },
  };

  provide(ThemeEditorKey, value);
  return value;
}

export function useThemeEditor(): ThemeEditorValue {
  const context = inject(ThemeEditorKey, null);

  if (!context) {
    throw new Error("useThemeEditor deve ser usado dentro de useThemeEditorProvide()");
  }

  return context;
}
