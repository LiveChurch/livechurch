import { defineStore } from "pinia";
import { shallowReactive } from "vue";
import type { OpenedModal } from "@/core/types/modal";

/**
 * Modals opened via `openModal`, in the order they were opened.
 * `shallowReactive`: each modal's component and props must not become proxies.
 */
export const useModalStore = defineStore("modal", () => {
  const state = shallowReactive({
    opened: [] as OpenedModal[],
  });

  const actions = {
    add(modal: OpenedModal) {
      state.opened = [...state.opened, modal];
    },

    remove(id: number) {
      state.opened = state.opened.filter((modal) => modal.id !== id);
    },
  };

  return { state, actions };
});
