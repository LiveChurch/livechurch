import { defineStore } from "pinia";
import { reactive } from "vue";

const DEFAULT_DURATION_MS = 6000;

export interface UndoToast {
  id: string;
  message: string;
  durationMs: number;
  onUndo: () => void;
}

/**
 * Undo toast shown in the footer. Only one exists at a time: a new destructive
 * action replaces the previous toast (the previous action can no longer be undone).
 */
export const useUndoToastStore = defineStore("undoToast", () => {
  const state = reactive({ current: null as UndoToast | null });
  let timer: ReturnType<typeof setTimeout> | undefined;

  const actions = {
    show(message: string, onUndo: () => void, durationMs = DEFAULT_DURATION_MS) {
      clearTimeout(timer);
      state.current = { id: crypto.randomUUID(), message, durationMs, onUndo };
      timer = setTimeout(actions.dismiss, durationMs);
    },

    undo() {
      state.current?.onUndo();
      actions.dismiss();
    },

    dismiss() {
      clearTimeout(timer);
      state.current = null;
    },
  };

  return { state, actions };
});
