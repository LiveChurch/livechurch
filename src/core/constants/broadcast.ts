import type { BroadcastStyle } from "@/core/types/broadcast";
import { I18n } from "@/core/i18n/I18n";

export const DEFAULT_BROADCAST_STYLE: BroadcastStyle = {
  visible: true,
  position: "bottom",
  keyColor: "#00ff00",
  fontScale: 0.8,
  showReference: true,
  offsetX: 0,
  offsetY: 0,
  textBackground: { enabled: false, color: "#000000", opacity: 0.6, paddingX: 8, paddingY: 8 },
  textOutline: { color: "#000000", width: 0 },
};

export const BROADCAST_FONT_SCALE = { min: 0.4, max: 1.5, step: 0.05 };
export const BROADCAST_OFFSET = { min: -50, max: 50, step: 1 };
export const BROADCAST_BACKGROUND_PADDING = { min: 0, max: 60, step: 2 };
export const BROADCAST_OUTLINE_WIDTH = { min: 0, max: 12, step: 0.5 };

/** Fraction of the window height taken by the caption band. */
export const BROADCAST_BAND_FRACTION = 0.3;

/** Chroma key colors most used in OBS. */
export const BROADCAST_KEY_PRESETS = [
  { get label() { return I18n.t("core.broadcast.green"); }, value: "#00ff00" },
  { get label() { return I18n.t("components.themeSelector.colors.blue"); }, value: "#0000ff" },
  { get label() { return I18n.t("core.broadcast.magenta"); }, value: "#ff00ff" },
];
