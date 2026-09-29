import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_GRADIENT,
} from "@/core/state/theme/themeNormalization";
import type { BackgroundFill, SlidesTheme } from "@/core/types/theme";
import { BackgroundRotationUtils } from "./BackgroundRotationUtils";

type BackgroundFillSource = Pick<
  SlidesTheme,
  | "backgroundMode"
  | "backgroundColor"
  | "backgroundGradient"
  | "rotateBackgrounds"
  | "backgroundColors"
>;

export const BackgroundFillUtils = {
  /** Theme's color and gradient, or the default when absent. */
  fillOf(theme: BackgroundFillSource): BackgroundFill {
    return {
      color: theme.backgroundColor || DEFAULT_BACKGROUND_COLOR,
      gradient: theme.backgroundGradient ?? DEFAULT_BACKGROUND_GRADIENT,
    };
  },

  /**
   * CSS `background` value of the color (solid or gradient); empty when the theme uses no color.
   * With rotation active, `seed` (the playlist item) chooses which color to use.
   */
  toCss(theme: BackgroundFillSource, seed?: string): string {
    if (theme.backgroundMode !== "color") return "";

    const { color, gradient } =
      BackgroundRotationUtils.pickFill(theme, seed) ?? BackgroundFillUtils.fillOf(theme);
    if (!gradient.enabled) return color;

    return `linear-gradient(${gradient.angle}deg, ${color}, ${gradient.to})`;
  },
};
