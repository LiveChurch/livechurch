/** Watermark anchor relative to the slide (3x3 grid). */
export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/** Fixed watermark (logo) over the slide, configurable in the footer. */
export interface WatermarkSettings {
  enabled: boolean;
  /** Image data URL, or empty when no logo has been uploaded yet. */
  imageUrl: string;
  position: WatermarkPosition;
  /** 0 a 1 (1 = 100% opaca). */
  opacity: number;
  /** Logo width in % of the slide width. */
  sizePercent: number;
}
