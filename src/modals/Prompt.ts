import PromptModal from "./Prompt/PromptModal.vue";
import { openModal } from "./openModal";

export interface PromptConfig {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

/** Ports the Alert.ts pattern to ask for text: `Prompt.show(config): Promise<string | null>`. */
export default {
  show(config: PromptConfig): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      let confirmedValue: string | null = null;

      const modal = openModal(PromptModal, {
        ...config,
        onConfirm(value: string) {
          confirmedValue = value;
          resolve(value);
        },
      });

      modal.onDismiss(() => {
        if (confirmedValue === null) resolve(null);
      });
    });
  },
};
