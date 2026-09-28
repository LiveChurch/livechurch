<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import { NOTICE_MAX_LENGTH } from "@/core/constants/notice";
import type { LiveNotice } from "@/core/types/live";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Notice text, with a button to switch between one line and multiple lines.
 * In one line, Enter shows the notice; in multiple, Enter breaks the line and Ctrl+Enter shows it.
 */
const props = defineProps<{
  draft: LiveNotice;
}>();

const emit = defineEmits<{
  submit: [];
}>();

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const multiline = ref(props.draft.text.includes("\n"));

/** Text with a line break (e.g. coming from the history) only fits multi-line mode. */
watch(
  () => props.draft.text,
  (text) => {
    if (text.includes("\n")) multiline.value = true;
  },
);

/** Waits for the field to switch between `InputText` and `Textarea` before focusing. */
const focus = () => nextTick(() => inputRef.value?.focus());

const toggleMultiline = () => {
  multiline.value = !multiline.value;
  if (!multiline.value) props.draft.text = props.draft.text.replace(/\s*\n\s*/g, " ");
  void focus();
};

const onEnter = (event: KeyboardEvent) => {
  if (multiline.value && !event.ctrlKey) return;
  event.preventDefault();
  emit("submit");
};

defineExpose({ focus });
</script>

<template>
  <div class="flex flex-col gap-1">
    <Input
      id="notice-text"
      ref="inputRef"
      v-model="draft.text"
      :type="multiline ? 'textarea' : 'text'"
      :rows="3"
      :label="t('modals.notice.noticeText')"
      :placeholder="t('modals.notice.noticeTextExample')"
      :maxlength="NOTICE_MAX_LENGTH"
      autofocus
      @keydown.enter="onEnter"
    >
      <template #suffix>
        <Button
          type="button"
          variant="text"
          severity="secondary"
          :icon="multiline ? 'pi pi-minus' : 'pi pi-align-left'"
          :aria-label="multiline ? t('modals.notice.useOneLine') : t('modals.notice.useMultipleLines')"
          :title="multiline ? t('modals.notice.useOneLine') : t('modals.notice.useMultipleLines')"
          :aria-pressed="multiline"
          class="p-1 text-muted-foreground hover:text-surface-foreground"
          @click="toggleMultiline"
        />
      </template>
    </Input>
    <p v-if="multiline" class="text-xs text-muted-foreground">{{ t('modals.notice.ctrlEnterHint') }}</p>
  </div>
</template>
