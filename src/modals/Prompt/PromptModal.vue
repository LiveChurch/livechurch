<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Ports the ConfirmModal.vue pattern to ask for text instead of just confirming. */
const props = withDefaults(
  defineProps<{
    onConfirm?: (value: string) => void;
    title: string;
    message?: string;
    placeholder?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
  }>(),
  {},
);

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const value = ref(props.defaultValue ?? "");

const handleConfirm = () => {
  const trimmed = value.value.trim();
  if (!trimmed) return;
  props.onConfirm?.(trimmed);
  close();
};
</script>

<template>
  <Modal ref="modalRef" :title="props.title" class-name="max-w-md">
    <p v-if="props.message" class="mb-3 text-muted-foreground">{{ props.message }}</p>
    <Input v-model="value" :placeholder="props.placeholder" autofocus @keyup.enter="handleConfirm" />

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
          class="bg-primary text-white hover:bg-primary-hover"
          :label="props.confirmText ?? t('common.actions.confirm')"
          :disabled="!value.trim()"
          @click="handleConfirm"
        />
      </div>
    </template>
  </Modal>
</template>
