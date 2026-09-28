<script setup lang="ts">
import Slider from "primevue/slider";
import ColorField from "@/components/ui/ColorField.vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import type { BackgroundFill, BackgroundGradient } from "@/core/types/theme";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Edits a background color: start color and, optionally, a gradient to the end color. */
const props = defineProps<{
  idPrefix: string;
  modelValue: BackgroundFill;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: BackgroundFill];
}>();

function setColor(color: string) {
  emit("update:modelValue", { ...props.modelValue, color });
}

function updateGradient(changes: Partial<BackgroundGradient>) {
  emit("update:modelValue", {
    ...props.modelValue,
    gradient: { ...props.modelValue.gradient, ...changes },
  });
}

function setAngle(value: number | number[] | undefined) {
  if (typeof value === "number") updateGradient({ angle: value });
}
</script>

<template>
  <div class="flex flex-col gap-4 rounded-lg border border-border/60 bg-surface-light/20 p-4">
    <slot name="header" />

    <ToggleSwitch
      :id="`${idPrefix}-gradient-enabled`"
      :label="t('components.themeSelector.gradient')"
      :model-value="modelValue.gradient.enabled"
      @update:model-value="updateGradient({ enabled: $event })"
    />

    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <ColorField
        :id="`${idPrefix}-color`"
        :label="modelValue.gradient.enabled ? 'Cor inicial' : 'Cor de fundo'"
        :model-value="modelValue.color"
        @update:model-value="setColor"
      />
      <ColorField
        v-if="modelValue.gradient.enabled"
        :id="`${idPrefix}-gradient-to`"
        :label="t('components.themeSelector.endColor')"
        :model-value="modelValue.gradient.to"
        @update:model-value="updateGradient({ to: $event })"
      />

      <div v-if="modelValue.gradient.enabled" class="flex min-w-48 flex-1 items-center gap-3">
        <span :id="`${idPrefix}-angle-label`" class="text-sm font-medium text-muted-foreground">{{ t('components.themeSelector.angle') }}</span>
        <Slider
          :model-value="modelValue.gradient.angle"
          :min="0"
          :max="360"
          :step="5"
          :aria-labelledby="`${idPrefix}-angle-label`"
          class="min-w-0 flex-1"
          @update:model-value="setAngle"
        />
        <span class="w-10 text-right text-xs tabular-nums text-muted-foreground">
          {{ modelValue.gradient.angle }}°
        </span>
      </div>
    </div>
  </div>
</template>
