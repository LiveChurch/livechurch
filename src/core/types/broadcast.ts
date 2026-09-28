export type BroadcastPosition = "top" | "bottom";

/** `caption`: only the lyrics over chroma key; `live`: the same image as the live output (projector). */
export type BroadcastMode = "caption" | "live";

/** Background behind the lyrics (no rounded corners); with padding 0 it sits tight against the lyrics. */
export interface BroadcastTextBackground {
  enabled: boolean;
  color: string;
  opacity: number;
  /** Space between the lyrics and the background edge (horizontal and vertical), in pixels (1080p base). */
  paddingX: number;
  paddingY: number;
}

/** Outline of the lyrics, with the thickness in pixels (1080p base). */
export interface BroadcastTextOutline {
  color: string;
  width: number;
}

/**
 * Caption (lower third) settings in the broadcast output window (OBS).
 * Font, colors, shadow and transition come from the on-air slide's theme; the lyrics' background and outline
 * are defined here; it also applies to the reference.
 */
export interface BroadcastStyle {
  /** Turns the caption off without closing the window captured by OBS. */
  visible: boolean;
  position: BroadcastPosition;
  /** Solid background color of the window, removed in OBS with the Chroma Key filter. */
  keyColor: string;
  /** Multiplier applied to the theme's font size (1 = 100%). */
  fontScale: number;
  /** Shows the reference (e.g. "John 3:16 · NIV") on Bible slides. */
  showReference: boolean;
  /** Caption offset in % of the window width/height (positive = right/down). */
  offsetX: number;
  offsetY: number;
  textBackground: BroadcastTextBackground;
  textOutline: BroadcastTextOutline;
}
