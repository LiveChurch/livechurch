<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  currentName: string;
  onRename: (name: string) => void;
}>();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const name = ref(props.currentName);
const trimmedName = computed(() => name.value.trim());
const canSubmit = computed(
  () => !!trimmedName.value && trimmedName.value !== props.currentName,
);

const submit = () => {
  if (!canSubmit.value) return;
  props.onRename(trimmedName.value);
  close();
};
</script>

<template>
  <Modal ref="modalRef" :title="t('modals.renameItem.title')" class-name="max-w-md">
    <Input
      id="rename-item-name"
      v-model="name"
      :label="t('modals.renameItem.name')"
      :maxlength="80"
      autofocus
      @keydown.enter="submit"
    />

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('control.playlist.rename')"
          :disabled="!canSubmit"
          @click="submit"
        />
      </div>
    </template>
  </Modal>
</template>
