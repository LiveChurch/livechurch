import type { Component } from "vue";

/**
 * Handle injected into the modals opened by `openModal`. The modal shell
 * (`Modal.vue`, `CalendarModal.vue`) calls `onHidden()` after the Dialog
 * finishes closing (ESC, outside click, close button), so it leaves the screen.
 */
export interface ModalHandle {
  onHidden: () => void;
}

/** Open modal, rendered by `ModalHost` inside the main app. */
export interface OpenedModal {
  id: number;
  component: Component;
  props: Record<string, unknown>;
  handle: ModalHandle;
}
