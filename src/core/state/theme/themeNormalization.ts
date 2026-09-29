import type {
  BackgroundGradient,
  SlidesTheme,
  TextBackground,
  TextOutline,
  TextShadow,
  TitleStyle,
} from "../../types/theme";
import { I18n } from "@/core/i18n/I18n";

export const DEFAULT_BACKGROUND_OPACITY = 0.3;
export const DEFAULT_LINE_HEIGHT = 1.2;
export const DEFAULT_LETTER_SPACING = 0;
export const DEFAULT_TEXT_MARGIN = 88;
export const DEFAULT_BACKGROUND_COLOR = "#1e1b4b";
export const DEFAULT_BACKGROUND_GRADIENT: BackgroundGradient = {
  enabled: false,
  to: "#000000",
  angle: 135,
};

export const DEFAULT_TEXT_OUTLINE: TextOutline = { color: "#000000", width: 0 };
export const DEFAULT_TEXT_BACKGROUND: TextBackground = {
  enabled: false,
  color: "#000000",
  opacity: 0.5,
  padding: 16,
};
export const DEFAULT_TEXT_SHADOW: TextShadow = {
  enabled: false,
  color: "#000000",
  blur: 8,
  offsetX: 0,
  offsetY: 2,
};

export const DEFAULT_TITLE_STYLE: TitleStyle = {
  visible: true,
  fontFamily: "",
  fontScale: 1,
  fontBold: true,
  fontItalic: false,
  fontUppercase: true,
  lineHeight: 1.28,
  letterSpacing: 0.22,
  textAlign: "center",
  textMargin: 0,
  textColor: "",
  textOutline: DEFAULT_TEXT_OUTLINE,
  textBackground: DEFAULT_TEXT_BACKGROUND,
  textShadow: DEFAULT_TEXT_SHADOW,
};

export function normalizeTheme(
  theme: SlidesTheme,
  fallbackId: string,
): SlidesTheme {
  return {
    ...theme,
    id: theme.id || fallbackId,
    categories: theme.categories ?? [],
    backgroundMode: theme.backgroundMode ?? "image",
    backgroundColor: theme.backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
    backgroundGradient: theme.backgroundGradient ?? DEFAULT_BACKGROUND_GRADIENT,
    backgroundOpacity: theme.backgroundOpacity ?? DEFAULT_BACKGROUND_OPACITY,
    fontScale: theme.fontScale ?? 1,
    fontBold: theme.fontBold ?? true,
    fontItalic: theme.fontItalic ?? false,
    fontUppercase: theme.fontUppercase ?? false,
    lineHeight: theme.lineHeight ?? DEFAULT_LINE_HEIGHT,
    letterSpacing: theme.letterSpacing ?? DEFAULT_LETTER_SPACING,
    textAlign: theme.textAlign ?? "center",
    textAnchor: theme.textAnchor ?? "center",
    textMargin: theme.textMargin ?? DEFAULT_TEXT_MARGIN,
    textColor: theme.textColor ?? "",
    textOutline: theme.textOutline ?? DEFAULT_TEXT_OUTLINE,
    textBackground: theme.textBackground ?? DEFAULT_TEXT_BACKGROUND,
    textShadow: theme.textShadow ?? DEFAULT_TEXT_SHADOW,
    titleStyle: theme.titleStyle ?? DEFAULT_TITLE_STYLE,
    gradientColor: theme.gradientColor ?? "",
    gradientAnimated: theme.gradientAnimated ?? false,
    transition: theme.transition ?? { type: "fade" },
    effects: {
      embers: theme.effects?.embers ?? false,
      rain: theme.effects?.rain ?? false,
      snow: theme.effects?.snow ?? false,
    },
  };
}

export function clampFontScale(value: number): number {
  return Number(Math.max(0.7, Math.min(1.6, value)).toFixed(2));
}

export function createFallbackTheme(fontFamily: string): SlidesTheme {
  return normalizeTheme(
    {
      id: "theme-default",
      backgroundId: "pink-glow",
      backgroundUrl:
        "https://media.giphy.com/media/lKaeQAunM3hZaqsOpj/giphy.gif",
      fontFamily,
      name: I18n.t("core.backgrounds.pinkGlowName"),
    },
    "theme-default",
  );
}
