import { I18n } from "@/core/i18n/I18n";
export const THEME_PANEL_SECTIONS = [
  { id: "background", get label() { return I18n.t("components.themeSelector.sections.background"); } },
  { id: "gradient", get label() { return I18n.t("components.themeSelector.gradient"); } },
  { id: "text", get label() { return I18n.t("components.themeSelector.sections.text"); } },
  { id: "title", get label() { return I18n.t("components.themeSelector.sections.title"); } },
  { id: "animation", get label() { return I18n.t("components.themeSelector.sections.animation"); } },
] as const;

export type ThemePanelSection = (typeof THEME_PANEL_SECTIONS)[number]["id"];
