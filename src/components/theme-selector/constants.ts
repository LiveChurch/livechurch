import { I18n } from "@/core/i18n/I18n";
export const GRADIENT_PRESETS = [
  { id: "indigo", get name() { return I18n.t("components.themeSelector.colors.indigo"); }, color: "#6366f1" },
  { id: "violet", get name() { return I18n.t("components.themeSelector.colors.violet"); }, color: "#8b5cf6" },
  { id: "fuchsia", get name() { return I18n.t("components.themeSelector.colors.fuchsia"); }, color: "#d946ef" },
  { id: "rose", get name() { return I18n.t("components.themeSelector.colors.rose"); }, color: "#f43f5e" },
  { id: "amber", get name() { return I18n.t("components.themeSelector.colors.amber"); }, color: "#f59e0b" },
  { id: "emerald", get name() { return I18n.t("components.themeSelector.colors.emerald"); }, color: "#10b981" },
  { id: "teal", get name() { return I18n.t("components.themeSelector.colors.teal"); }, color: "#14b8a6" },
  { id: "cyan", get name() { return I18n.t("components.themeSelector.colors.cyan"); }, color: "#06b6d4" },
  { id: "blue", get name() { return I18n.t("components.themeSelector.colors.blue"); }, color: "#3b82f6" },
  { id: "sky", get name() { return I18n.t("components.themeSelector.colors.sky"); }, color: "#0ea5e9" },
  { id: "orange", get name() { return I18n.t("components.themeSelector.colors.orange"); }, color: "#f97316" },
  { id: "red", get name() { return I18n.t("components.themeSelector.colors.red"); }, color: "#ef4444" },
] as const;
