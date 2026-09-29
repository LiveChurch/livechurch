import { DEFAULT_BACKGROUND_GRADIENT } from "@/core/state/theme/themeNormalization";
import type { BackgroundFill, SlideBackground, SlidesTheme } from "@/core/types/theme";

type RotationSource = Pick<
  SlidesTheme,
  "rotateBackgrounds" | "backgroundIds" | "backgroundColors" | "backgroundGradient"
>;

/** Stable number derived from the text, so the same item always lands on the same background. */
function hashOf(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function pick<T>(options: T[], seed: string | undefined): T | undefined {
  if (options.length === 0) return undefined;
  return options[seed ? hashOf(seed) % options.length : 0];
}

export const BackgroundRotationUtils = {
  /** Item's color; empty when the theme does not rotate colors. */
  pickFill(theme: RotationSource, seed?: string): BackgroundFill | undefined {
    if (!theme.rotateBackgrounds) return undefined;
    return pick(BackgroundRotationUtils.fillsOf(theme), seed);
  },

  /** Rotation colors; converts the ones saved in the old format (only the color text). */
  fillsOf(theme: RotationSource): BackgroundFill[] {
    const legacy: unknown[] = theme.backgroundColors ?? [];
    return legacy.map((entry) =>
      typeof entry === "string"
        ? { color: entry, gradient: theme.backgroundGradient ?? DEFAULT_BACKGROUND_GRADIENT }
        : (entry as BackgroundFill),
    );
  },

  /** Item's image; empty when the theme does not rotate images. */
  pickImageUrl(
    theme: RotationSource,
    backgrounds: SlideBackground[],
    seed?: string,
  ): string | undefined {
    if (!theme.rotateBackgrounds) return undefined;
    const images = (theme.backgroundIds ?? [])
      .map((id) => backgrounds.find((background) => background.id === id))
      .filter((background) => background !== undefined);
    return pick(images, seed)?.backgroundImage;
  },

  /** Adds or removes `value`, keeping at least one item. */
  toggle(values: string[], value: string): string[] {
    if (!values.includes(value)) return [...values, value];
    return values.length > 1 ? values.filter((entry) => entry !== value) : values;
  },
};
