import RecurringDeleteModal from "./RecurringDeleteModal.vue";
import { openModal } from "@/modals/openModal";

export type RecurringDeleteChoice = "instance" | "future" | "all";

export interface RecurringDeleteConfig {
  eventTitle: string;
}

/** Ports the Alert.ts pattern to a 3-option choice (recurring event). */
export default {
  show(config: RecurringDeleteConfig): Promise<RecurringDeleteChoice | null> {
    return new Promise((resolve) => {
      let chosen: RecurringDeleteChoice | null = null;

      const modal = openModal(RecurringDeleteModal, {
        ...config,
        onChoose(choice: RecurringDeleteChoice) {
          chosen = choice;
          resolve(choice);
        },
      });

      modal.onDismiss(() => {
        if (!chosen) resolve(null);
      });
    });
  },
};
