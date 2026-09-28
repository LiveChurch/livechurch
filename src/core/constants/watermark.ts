import type { WatermarkSettings } from "@/core/types/watermark";
import { I18n } from "@/core/i18n/I18n";

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  enabled: false,
  imageUrl: "",
  position: "bottom-right",
  opacity: 0.8,
  sizePercent: 12,
};

export const WATERMARK_OPACITY = { min: 0, max: 100, step: 5 };
export const WATERMARK_SIZE = { min: 4, max: 40, step: 1 };

export const WATERMARK_POSITION_OPTIONS: { label: string; value: WatermarkSettings["position"] }[] = [
  { get label() { return I18n.t("core.watermark.topLeft"); }, value: "top-left" },
  { get label() { return I18n.t("core.watermark.topCenter"); }, value: "top-center" },
  { get label() { return I18n.t("core.watermark.topRight"); }, value: "top-right" },
  { get label() { return I18n.t("core.watermark.middleLeft"); }, value: "middle-left" },
  { get label() { return I18n.t("core.watermark.middleCenter"); }, value: "middle-center" },
  { get label() { return I18n.t("core.watermark.middleRight"); }, value: "middle-right" },
  { get label() { return I18n.t("core.watermark.bottomLeft"); }, value: "bottom-left" },
  { get label() { return I18n.t("core.watermark.bottomCenter"); }, value: "bottom-center" },
  { get label() { return I18n.t("core.watermark.bottomRight"); }, value: "bottom-right" },
];
