import { useUpdateStore } from "@/core/state/update/updateStore";
import Alert from "@/modals/Alert";
import { I18n } from "@/core/i18n/I18n";

/** Check requested by the Help menu: if there is a new version, the update button appears in the header. */
export function useCheckForUpdates() {
  const updateCtx = useUpdateStore();

  return async () => {
    try {
      await updateCtx.actions.check();
    } catch (error) {
      console.error("Falha ao verificar atualizações", error);
      await Alert.show({
        title: I18n.t("common.terms.checkTitle"),
        message: I18n.t("control.update.serverError"),
        confirmText: I18n.t("common.actions.ok"),
      });
      return;
    }

    if (updateCtx.state.status === "idle") {
      await Alert.show({
        title: I18n.t("common.terms.checkTitle"),
        message: I18n.t("control.update.upToDate"),
        confirmText: I18n.t("common.actions.ok"),
      });
    }
  };
}
