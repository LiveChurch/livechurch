import { I18n } from "@/core/i18n/I18n";
export interface KeyboardShortcut {
  keys: string[];
  description: string;
}

export interface KeyboardShortcutGroup {
  title: string;
  shortcuts: KeyboardShortcut[];
}

export const KEYBOARD_SHORTCUT_GROUPS: KeyboardShortcutGroup[] = [
  {
    get title() { return I18n.t("core.shortcuts.presentation"); },
    shortcuts: [
      { keys: ["Ctrl", "A"], get description() { return I18n.t("core.shortcuts.presentLive"); } },
      { keys: ["↑"], get description() { return I18n.t("core.shortcuts.previousSlide"); } },
      { keys: ["↓"], get description() { return I18n.t("core.shortcuts.nextSlide"); } },
    ],
  },
  {
    get title() { return I18n.t("core.shortcuts.quickShortcut"); },
    shortcuts: [
      { get keys() { return [I18n.t("core.shortcuts.type")]; }, get description() { return I18n.t("core.shortcuts.openShortcut"); } },
      { keys: ["Shift", "Shift"], get description() { return I18n.t("core.shortcuts.openAtChapter"); } },
      { keys: ["Enter"], get description() { return I18n.t("core.shortcuts.addToPlaylist"); } },
      { keys: ["Ctrl", "Enter"], get description() { return I18n.t("core.shortcuts.addAndPresent"); } },
      { keys: ["Esc"], get description() { return I18n.t("core.shortcuts.cancel"); } },
    ],
  },
  {
    get title() { return I18n.t("core.shortcuts.search"); },
    shortcuts: [
      { keys: ["Enter"], get description() { return I18n.t("core.shortcuts.addResult"); } },
      { keys: ["Ctrl", "Enter"], get description() { return I18n.t("core.shortcuts.addResultAndPresent"); } },
    ],
  },
  {
    get title() { return I18n.t("core.shortcuts.editors"); },
    shortcuts: [
      { keys: ["Ctrl", "S"], get description() { return I18n.t("core.shortcuts.saveSlidesText"); } },
      { keys: ["Ctrl", "Enter"], get description() { return I18n.t("core.shortcuts.showNotice"); } },
    ],
  },
];
