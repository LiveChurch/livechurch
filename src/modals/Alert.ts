import ConfirmModal from "./Confirm/ConfirmModal.vue";
import { openModal } from "./openModal";

export interface AlertConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

/**
 * Port of src/modals/Alert.ts — same API `Alert.show(config): Promise<boolean>`,
 * now on top of the `openModal` service (PrimeVue Dialog; replaces Quasar's
 * Dialog plugin).
 */
export default {
  show(config: AlertConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let confirmed = false;

      const modal = openModal(ConfirmModal, {
        ...config,
        onConfirm() {
          confirmed = true;
          resolve(true);
        },
      });

      // Fires on cancel (X, cancel button, ESC, outside click).
      modal.onDismiss(() => {
        if (!confirmed) resolve(false);
      });
    });
  },
};
