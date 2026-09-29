import type { UpdateState } from "@/core/types/update";
import { I18n } from "@/core/i18n/I18n";

export interface UpdateButtonView {
  label: string;
  title: string;
  icon: string;
  disabled: boolean;
}

/** How the update button appears at each stage; null when there is nothing to show. */
export const UpdateButtonStates = {
  of(state: UpdateState): UpdateButtonView | null {
    const percent = Math.round(state.progress * 100);

    switch (state.status) {
      case "available":
        return {
          label: I18n.t("control.update.updateTo", { version: state.version }),
          title: state.notes
            ? I18n.t("control.update.newVersionNotes", { version: state.version, notes: state.notes })
            : I18n.t("control.update.newVersion", { version: state.version }),
          icon: "pi pi-download",
          disabled: false,
        };
      case "downloading":
        return {
          label: I18n.t("control.update.downloadingPercent", { percent }),
          title: I18n.t("control.update.downloading"),
          icon: "pi pi-spin pi-spinner",
          disabled: true,
        };
      case "ready":
        return {
          label: I18n.t("control.update.restartToUpdate"),
          title: I18n.t("control.update.readyToInstall", { version: state.version }),
          icon: "pi pi-refresh",
          disabled: false,
        };
      case "error":
        return {
          label: I18n.t("control.update.retry"),
          title: state.error ?? I18n.t("control.update.downloadFailed"),
          icon: "pi pi-exclamation-triangle",
          disabled: false,
        };
      default:
        return null;
    }
  },
};
