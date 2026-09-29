import { BackgroundFillUtils } from "@/core/utils/BackgroundFillUtils";
import type { BackgroundMode, SlidesTheme } from "@/core/types/theme";
import { I18n } from "@/core/i18n/I18n";

export type BackgroundVariantId =
  | "single-image"
  | "rotating-images"
  | "single-color"
  | "rotating-colors"
  | "none";

interface BackgroundVariant {
  id: BackgroundVariantId;
  label: string;
  mode: BackgroundMode;
  rotate: boolean;
}

export const BACKGROUND_VARIANTS: BackgroundVariant[] = [
  { id: "single-image", get label() { return I18n.t("components.themeSelector.singleImage"); }, mode: "image", rotate: false },
  { id: "rotating-images", get label() { return I18n.t("components.themeSelector.rotatingImages"); }, mode: "image", rotate: true },
  { id: "single-color", get label() { return I18n.t("components.themeSelector.singleColor"); }, mode: "color", rotate: false },
  { id: "rotating-colors", get label() { return I18n.t("components.themeSelector.rotatingColors"); }, mode: "color", rotate: true },
  { id: "none", get label() { return I18n.t("components.themeSelector.none"); }, mode: "none", rotate: false },
];

export const BackgroundVariants = {
  of(theme: SlidesTheme): BackgroundVariantId {
    const mode = theme.backgroundMode ?? "image";
    const rotate = theme.rotateBackgrounds ?? false;
    return BACKGROUND_VARIANTS.find((v) => v.mode === mode && (mode === "none" || v.rotate === rotate))!.id;
  },

  /** Applies the variant to the theme; when switching, ensures the first item of the images/colors list. */
  apply(theme: SlidesTheme, id: BackgroundVariantId) {
    const variant = BACKGROUND_VARIANTS.find((v) => v.id === id)!;
    theme.backgroundMode = variant.mode;
    theme.rotateBackgrounds = variant.rotate;
    if (!variant.rotate) return;

    if (!theme.backgroundIds?.length && theme.backgroundId) {
      theme.backgroundIds = [theme.backgroundId];
    }
    if (!theme.backgroundColors?.length) {
      theme.backgroundColors = [BackgroundFillUtils.fillOf(theme)];
    }
  },
};
