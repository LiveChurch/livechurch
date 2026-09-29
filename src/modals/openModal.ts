import type { Component, InjectionKey } from "vue";
import { useModalStore } from "@/core/state/modal/modalStore";
import type { ModalHandle } from "@/core/types/modal";

export const MODAL_HANDLE: InjectionKey<ModalHandle> = Symbol("livechurch-modal-handle");

export interface OpenModalHandle {
  /** Callback fired when the modal is closed by any means. */
  onDismiss: (callback: () => void) => void;
}

let lastModalId = 0;

/**
 * Replacement for Quasar's `Dialog` plugin: registers the modal in the store and
 * `ModalHost` renders it inside the main app (same Pinia, PrimeVue and theme).
 * It leaves the store when the inner Dialog reports it was hidden.
 *
 * Usage: `openModal(TextEditorModal, { initialText, onSave })`.
 */
export function openModal(
  component: Component,
  componentProps: Record<string, unknown> = {},
): OpenModalHandle {
  const { actions } = useModalStore();
  const id = ++lastModalId;
  const dismissCallbacks: Array<() => void> = [];
  let hidden = false;

  actions.add({
    id,
    component,
    props: componentProps,
    handle: {
      onHidden() {
        if (hidden) return;
        hidden = true;
        actions.remove(id);
        dismissCallbacks.forEach((callback) => callback());
      },
    },
  });

  return {
    onDismiss(callback: () => void) {
      if (hidden) {
        callback();
        return;
      }
      dismissCallbacks.push(callback);
    },
  };
}
