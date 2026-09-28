<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import { StringUtils } from "@/core/utils/StringUtils";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Text slides editor: blocks separated by a blank line become
 * slides, with the preview list beside it (used when editing and creating slides).
 */
const text = defineModel<string>({ required: true });

const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);

const linesPerSlide = ref(2);

const regroupHistory = ref<string[]>([]);

const regroup = () => {
  regroupHistory.value.push(text.value);
  text.value = StringUtils.regroupLines(text.value, linesPerSlide.value || 1);
};

const undoRegroup = () => {
  const previous = regroupHistory.value.pop();
  if (previous !== undefined) text.value = previous;
};

const blocks = computed(() => StringUtils.splitStanzas(text.value));

const focus = () =>
  (textareaRef.value?.$el as HTMLTextAreaElement | undefined)?.focus();

defineExpose({ focus });
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      class="flex items-center justify-between gap-4 border-b border-b border-primary/20 bg-primary/5 px-4 py-2 text-xs text-muted-foreground"
    >
      <span>{{ t('components.slidesEditor.blankLinesHint') }}</span>
      <div class="flex items-center gap-2">
        <label for="lines-per-slide">{{ t('components.slidesEditor.splitSlidesIn') }}</label>
        <InputNumber
          v-model="linesPerSlide"
          input-id="lines-per-slide"
          :min="1"
          :max="20"
          show-buttons
          button-layout="horizontal"
          size="small"
          input-class="w-14 text-center"
        />
        <span>{{ t('components.slidesEditor.lines') }}</span>
        <Button
          type="button"
          size="small"
          severity="secondary"
          :label="t('components.slidesEditor.split')"
          @click="regroup"
        />
        <Button
          type="button"
          size="small"
          severity="secondary"
          icon="pi pi-undo"
          :aria-label="t('common.actions.undo')"
          :disabled="!regroupHistory.length"
          @click="undoRegroup"
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1 overflow-hidden">
      <Textarea
        ref="textareaRef"
        v-model="text"
        rows="1"
        class="h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm text-surface-foreground outline-none focus:ring-0"
        :placeholder="t('components.slidesEditor.placeholder')"
        spellcheck="false"
        :aria-label="t('components.slidesEditor.contentLabel')"
      />
      <div
        class="custom-scrollbar w-64 space-y-2 overflow-y-auto border-l border-border bg-surface-light/30 p-4"
      >
        <div class="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {{ t('modals.templateEditor.preview') }}
        </div>
        <div
          v-for="(block, index) in blocks"
          :key="index"
          :class="
            cn(
              'rounded border p-2 text-xs leading-relaxed transition-colors',
              index === 0
                ? 'border-primary/50 bg-primary/20 text-primary'
                : 'border-border bg-surface-light/30 text-muted-foreground',
            )
          "
        >
          <div class="mb-1 font-mono text-xs opacity-60">Slide {{ index + 1 }}</div>
          <div class="whitespace-pre-wrap text-xs">
            {{ block }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
