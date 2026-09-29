export type DefaultThemeCategory = "bible" | "harpa" | "hymns" | "events";

export type UiTheme = "dark" | "light";

/** Vertical position of the text within the slide's usable area. */
export type TextAnchor = "top" | "center" | "bottom";

/** Horizontal alignment of the slide text. */
export type TextAlign = "left" | "center" | "right" | "justify";

/** Outline (stroke) drawn around the text letters. */
export interface TextOutline {
  color: string;
  /** Outline thickness, in pixels. */
  width: number;
}

/** Background box shown behind the text, like a caption. */
export interface TextBackground {
  enabled: boolean;
  color: string;
  opacity: number;
  /** Inner padding of the box around the text, in pixels (only vertical if `paddingX` is set). */
  padding: number;
  /** Side padding; when absent, uses `padding`. */
  paddingX?: number;
  /** Corner rounding, in pixels (default 12). */
  radius?: number;
}

/** Shadow cast by the text (independent of the slide's background image). */
export interface TextShadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface SlideBackground {
  id: string;
  name: string;
  backgroundImage: string;
  description: string;
  isAnimated?: boolean;
}

/** Type of the slide background fill. */
export type BackgroundMode = "image" | "color" | "none";

/** Color (solid or gradient) that fills the slide background. */
export interface BackgroundFill {
  color: string;
  gradient: BackgroundGradient;
}

/** Linear gradient going from `backgroundColor` to `to`. */
export interface BackgroundGradient {
  enabled: boolean;
  to: string;
  /** Gradient angle, in degrees. */
  angle: number;
}

/** Text style fields, shared by the slide's text and title. */
export interface TextStyleFields {
  fontFamily?: string;
  fontScale?: number;
  fontBold?: boolean;
  fontItalic?: boolean;
  fontUppercase?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: TextAlign;
  textAnchor?: TextAnchor;
  textMargin?: number;
  textColor?: string;
  textOutline?: TextOutline;
  textBackground?: TextBackground;
  textShadow?: TextShadow;
}

/** Slide title (e.g. "PSALM 23"): same style as the text; an empty `fontFamily` inherits the theme's. */
export interface TitleStyle extends TextStyleFields {
  visible: boolean;
}

export interface SlidesTheme {
  id: string;
  backgroundId?: string;
  backgroundUrl: string;
  /** Absent in old themes, which always use an image. */
  backgroundMode?: BackgroundMode;
  backgroundColor?: string;
  backgroundGradient?: BackgroundGradient;
  /** Switches the background for each playlist item, among `backgroundIds` or `backgroundColors`. */
  rotateBackgrounds?: boolean;
  /** Rotation images; the first is also kept in `backgroundId`/`backgroundUrl`. */
  backgroundIds?: string[];
  /** Rotation colors; the first is also kept in `backgroundColor`/`backgroundGradient`. */
  backgroundColors?: BackgroundFill[];
  /** Background image opacity, from 0 to 1. */
  backgroundOpacity?: number;
  fontFamily: string;
  fontScale?: number;
  fontBold?: boolean;
  fontItalic?: boolean;
  /** Shows all the slide text in uppercase letters. */
  fontUppercase?: boolean;
  /** Line height, as a multiple of the font size. */
  lineHeight?: number;
  /** Letter spacing, in `em`. */
  letterSpacing?: number;
  textAlign?: TextAlign;
  textAnchor?: TextAnchor;
  /** Side margin of the text, in pixels (at the slide's reference scale). */
  textMargin?: number;
  /** Text color; empty uses the interface theme's default color. */
  textColor?: string;
  textOutline?: TextOutline;
  textBackground?: TextBackground;
  textShadow?: TextShadow;
  titleStyle?: TitleStyle;
  name?: string;
  /** Categories in which the theme is offered; empty means all. */
  categories?: DefaultThemeCategory[];
  gradientColor?: string;
  gradientAnimated?: boolean;
  transition?: {
    type: "fade" | "bottom-to-up" | "word-behind";
  };
  effects?: {
    embers?: boolean;
    rain?: boolean;
    snow?: boolean;
  };
}

export interface SlidesThemeDraft extends Omit<SlidesTheme, "id"> {
  id?: string;
}

export type ThemeBinding =
  | {
      mode: "global";
      themeId: string;
    }
  | {
      /** Theme drawn among the global ones; stays fixed until a new draw. */
      mode: "random";
      themeId: string;
    }
  | {
      mode: "custom";
      theme: SlidesTheme;
    };
