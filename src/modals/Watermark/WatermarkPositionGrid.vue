<script setup lang="ts">
import Button from "primevue/button";
import { WATERMARK_POSITION_OPTIONS } from "@/core/constants/watermark";
import type { WatermarkPosition } from "@/core/types/watermark";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** 3x3 grid of anchors to position the watermark over the slide. */
defineProps<{
  modelValue: WatermarkPosition;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: WatermarkPosition];
}>();
</script>

<template>
  <div
    class="grid aspect-video w-48 grid-cols-3 gap-1 rounded-md border border-border bg-surface-light p-1.5"
    role="group"
    :aria-label="t('modals.watermark.position')"
  >
    <Button
      v-for="option in WATERMARK_POSITION_OPTIONS"
      :key="option.value"
      variant="text"
      severity="secondary"
      :title="option.label"
      :aria-label="option.label"
      :aria-pressed="modelValue === option.value"
      class="min-w-0 rounded p-0"
      @click="emit('update:modelValue', option.value)"
    >
      <span
        :class="
          cn(
            'block size-2 rounded-full bg-muted-foreground/50 transition-colors',
            modelValue === option.value && 'bg-primary',
          )
        "
      />
    </Button>
  </div>
</template>
