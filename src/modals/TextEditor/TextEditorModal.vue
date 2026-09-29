<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import Button from "primevue/button";
import SlidesTextEditor from "@/components/slides/SlidesTextEditor.vue";
import { StringUtils } from "@/core/utils/StringUtils";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/TextEditorModal.tsx (modal aberto via openModal()). */
const props = withDefaults(
  defineProps<{
    initialText?: string;
    onSave: (text: string) => void;
    title?: string;
  }>(),
  { initialText: "" },
);

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const text = ref(props.initialText);
const editorRef = ref<InstanceType<typeof SlidesTextEditor> | null>(null);
let focusTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.initialText,
  (value) => {
    text.value = value;
  },
);

// openModal() mounts the component already visible: initial focus on the textarea.
focusTimer = setTimeout(() => editorRef.value?.focus(), 100);
onUnmounted(() => clearTimeout(focusTimer));

const slideCount = computed(
  () => StringUtils.splitStanzas(text.value).length || 1,
);

const handleSave = () => {
  props.onSave(text.value);
  close();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    handleSave();
  }
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="props.title ?? t('modals.textEditor.title')"
    class-name="h-[80vh] w-full max-w-5xl"
    content-class-name="flex flex-col overflow-hidden p-0"
  >
    <SlidesTextEditor ref="editorRef" v-model="text" @keydown="handleKeydown" />

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <div class="text-xs text-muted-foreground">
          <span class="font-mono text-surface-foreground">{{ slideCount }}</span> slides
        </div>
        <div class="flex gap-2 justify-end">
          <Button
            variant="text"
            severity="secondary"
            class="bg-surface-light text-surface-foreground"
            :label="t('common.actions.cancel')"
            type="button"
            @click="close()"
          />
          <Button
            type="submit"
            icon="pi pi-save"
            :label="t('modals.textEditor.saveShortcut')"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>
