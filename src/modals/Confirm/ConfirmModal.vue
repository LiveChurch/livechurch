<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Port of src/modals/ConfirmModal.tsx (now as a modal opened via openModal()). */
const props = withDefaults(
  defineProps<{
    onConfirm?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }>(),
  { isDestructive: false },
);

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const handleConfirm = () => {
  props.onConfirm?.();
  close();
};
</script>

<template>
  <Modal ref="modalRef" :title="props.title" class-name="max-w-md">
    <p class="text-muted-foreground">{{ props.message }}</p>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="props.cancelText ?? t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          :class="
            props.isDestructive
              ? 'bg-danger text-white hover:bg-danger-hover'
              : 'bg-primary text-white hover:bg-primary-hover'
          "
          :label="props.confirmText ?? t('common.actions.confirm')"
          @click="handleConfirm"
        />
      </div>
    </template>
  </Modal>
</template>
