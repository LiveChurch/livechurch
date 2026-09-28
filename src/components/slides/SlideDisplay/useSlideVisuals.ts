import { computed, toValue } from "vue";
import type { ComputedRef, MaybeRefOrGetter } from "vue";
import { useThemeStore } from "@/core/state/theme/themeStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { BackgroundFillUtils } from "@/core/utils/BackgroundFillUtils";
import { BackgroundRotationUtils } from "@/core/utils/BackgroundRotationUtils";
import {
  DEFAULT_BACKGROUND_OPACITY,
  DEFAULT_LETTER_SPACING,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_TEXT_BACKGROUND,
  DEFAULT_TEXT_MARGIN,
  DEFAULT_TEXT_OUTLINE,
  DEFAULT_TEXT_SHADOW,
  DEFAULT_TITLE_STYLE,
} from "@/core/state/theme/themeNormalization";
import type {
  SlidesTheme,
  TextAlign,
  TextAnchor,
  TextBackground,
  TextOutline,
  TextShadow,
  TitleStyle,
} from "@/core/types/theme";
import type { BibleVersion, PlaylistItemType } from "@/core/types/playlist";

export interface SlideVisuals {
  /** Empty when the theme uses no background image. */
  backgroundUrl: string;
  backgroundFill: string;
  backgroundOpacity: number;
  fontFamily: string;
  fontScale: number;
  fontBold: boolean;
  fontItalic: boolean;
  fontUppercase: boolean;
  lineHeight: number;
  letterSpacing: number;
  textAlign: TextAlign;
  textAnchor: TextAnchor;
  textMargin: number;
  textColor: string;
  textOutline: TextOutline;
  textBackground: TextBackground;
  textShadow: TextShadow;
  titleStyle: TitleStyle;
  gradientColor: string;
  gradientAnimated: boolean;
  transitionType: "fade" | "bottom-to-up" | "word-behind";
  embersEnabled: boolean;
  rainEnabled: boolean;
  snowEnabled: boolean;
  bibleVersionLabel: string | null;
}

/**
 * Replaces React's useSlideVisuals hook. Receives refs/getters (the caller's
 * props) and returns a reactive `ComputedRef`.
 */
export function useSlideVisuals(
  theme?: MaybeRefOrGetter<SlidesTheme | undefined>,
  bibleVersion?: MaybeRefOrGetter<BibleVersion | undefined>,
  slideType?: MaybeRefOrGetter<PlaylistItemType | undefined>,
  itemId?: MaybeRefOrGetter<string | undefined>,
): ComputedRef<SlideVisuals> {
  const themeCtx = useThemeStore();
  const playlistCtx = usePlaylistStore();

  return computed<SlideVisuals>(() => {
    const current = themeCtx.state.currentTheme;
    const source = toValue(theme) ?? current;
    const version = toValue(bibleVersion) ?? playlistCtx.state.activeBibleVersion;

    const resolvedType = toValue(slideType);
    const isBibleSlide = resolvedType === "bible" || resolvedType === "bible-verse";
    const usesImage = (source.backgroundMode ?? "image") === "image";
    const seed = toValue(itemId);
    const rotatedUrl = BackgroundRotationUtils.pickImageUrl(
      source,
      themeCtx.state.availableBackgrounds,
      seed,
    );

    return {
      backgroundUrl: usesImage
        ? rotatedUrl || source.backgroundUrl || current.backgroundUrl
        : "",
      backgroundFill: BackgroundFillUtils.toCss(source, seed),
      backgroundOpacity:
        source.backgroundOpacity ??
        current.backgroundOpacity ??
        DEFAULT_BACKGROUND_OPACITY,
      fontFamily: source.fontFamily || current.fontFamily,
      fontScale: source.fontScale ?? current.fontScale ?? 1,
      fontBold: source.fontBold ?? current.fontBold ?? true,
      fontItalic: source.fontItalic ?? current.fontItalic ?? false,
      fontUppercase: source.fontUppercase ?? current.fontUppercase ?? false,
      lineHeight: source.lineHeight ?? current.lineHeight ?? DEFAULT_LINE_HEIGHT,
      letterSpacing:
        source.letterSpacing ?? current.letterSpacing ?? DEFAULT_LETTER_SPACING,
      textAlign: source.textAlign ?? current.textAlign ?? "center",
      textAnchor: source.textAnchor ?? current.textAnchor ?? "center",
      textMargin: source.textMargin ?? current.textMargin ?? DEFAULT_TEXT_MARGIN,
      textColor: source.textColor ?? current.textColor ?? "",
      textOutline: source.textOutline ?? current.textOutline ?? DEFAULT_TEXT_OUTLINE,
      textBackground: source.textBackground ?? current.textBackground ?? DEFAULT_TEXT_BACKGROUND,
      textShadow: source.textShadow ?? current.textShadow ?? DEFAULT_TEXT_SHADOW,
      titleStyle: source.titleStyle ?? current.titleStyle ?? DEFAULT_TITLE_STYLE,
      gradientColor: source.gradientColor ?? current.gradientColor ?? "",
      gradientAnimated:
        source.gradientAnimated ?? current.gradientAnimated ?? false,
      transitionType: source.transition?.type ?? "fade",
      embersEnabled: source.effects?.embers ?? false,
      rainEnabled: source.effects?.rain ?? false,
      snowEnabled: source.effects?.snow ?? false,
      bibleVersionLabel:
        isBibleSlide && version ? `${version.name} (${version.tag})` : null,
    };
  });
}
