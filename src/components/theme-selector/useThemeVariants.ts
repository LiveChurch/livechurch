import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { SlidesTheme } from "@/core/types/theme";
import { BackgroundRotationUtils } from "@/core/utils/BackgroundRotationUtils";

/**
 * Background possibilities of a theme with rotation: one copy of the theme per
 * selected image or color, each pinned to that background. Empty without rotation.
 */
export function useThemeVariants(theme: MaybeRefOrGetter<SlidesTheme>) {
  const themeStore = useThemeStore();

  return computed<SlidesTheme[]>(() => {
    const source = toValue(theme);
    if (!source.rotateBackgrounds) return [];

    const mode = source.backgroundMode ?? "image";
    if (mode === "color") {
      return BackgroundRotationUtils.fillsOf(source).map((fill) => ({
        ...source,
        rotateBackgrounds: false,
        backgroundColor: fill.color,
        backgroundGradient: fill.gradient,
      }));
    }
    if (mode === "image") {
      return (source.backgroundIds ?? [])
        .map((id) => themeStore.state.availableBackgrounds.find((bg) => bg.id === id))
        .filter((background) => background !== undefined)
        .map((background) => ({
          ...source,
          rotateBackgrounds: false,
          backgroundId: background.id,
          backgroundUrl: background.backgroundImage,
        }));
    }
    return [];
  });
}
