<script setup lang="ts">
import { inject, ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { cn } from "@/core/utils/ClassNameUtils";
import { MODAL_HANDLE } from "./openModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Modal shell — port of src/modals/Modal.tsx using PrimeVue's <Dialog>.
 *
 * Opened programmatically via `openModal()` (replacement for Quasar's Dialog
 * plugin): `ModalHost` injects a `ModalHandle` that is notified when the Dialog
 * finishes closing (X button, ESC or outside click), so the modal leaves the screen.
 * This component exposes `hide()` for parents to close the modal.
 */
const props = withDefaults(
  defineProps<{
    title?: string;
    className?: string; // extra classes of the content container (p-dialog)
    contentClassName?: string; // extra classes of the body wrapper
    showCloseButton?: boolean;
    /** False forces an explicit action: outside click and ESC no longer close it. */
    dismissable?: boolean;
  }>(),
  { showCloseButton: true, dismissable: true },
);

const handle = inject(MODAL_HANDLE, null);
const visible = ref(true);
const hide = () => {
  visible.value = false;
};

defineExpose({ hide });
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :show-header="false"
    :dismissable-mask="dismissable"
    :close-on-escape="dismissable"
    :pt="{ mask: 'p-4', content: 'p-0 flex min-h-0 flex-1 flex-col' }"
    :class="
      cn(
        'flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border-0 bg-surface text-surface-foreground shadow-2xl ring-1 ring-border',
        className,
      )
    "
    @after-hide="handle?.onHidden()"
  >
    <div
      v-if="title || props.showCloseButton"
      :class="
        cn(
          'flex items-center px-4 py-2',
          title ? 'justify-between border-b border-border/60' : 'justify-end pb-1',
        )
      "
    >
      <h3 v-if="title" class="text-lg font-semibold text-surface-foreground">
        {{ title }}
      </h3>

      <Button
        v-if="props.showCloseButton"
        variant="text"
        severity="secondary"
        :aria-label="t('modals.modal.close')"
        icon="pi pi-times"
        class="h-8 w-8 rounded-lg p-1.5 text-muted-foreground hover:bg-surface-light/60 hover:text-surface-foreground"
        @click="hide()"
      />
    </div>

    <div :class="cn('custom-scrollbar flex-1 overflow-y-auto p-6', contentClassName)">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="flex w-full items-center justify-between gap-3 rounded-b-xl border-t border-border/60 px-4 py-2"
    >
      <slot name="footer" />
    </div>
  </Dialog>
</template>
