<script setup lang="ts">
import { useId } from "vue";
import Slider from "primevue/slider";

/** Row of label + slider + value, used in the theme editor's numeric adjustments. */
const props = withDefaults(
  defineProps<{ label: string; min: number; max: number; step?: number; unit?: string }>(),
  { step: 1, unit: "px" },
);

const value = defineModel<number>({ required: true });
const labelId = useId();

const setValue = (next: number | number[] | undefined) => {
  if (typeof next === "number") value.value = next;
};
</script>

<template>
  <div class="flex items-center gap-3">
    <span :id="labelId" class="w-28 text-xs text-foreground">{{ props.label }}</span>
    <Slider
      :model-value="value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :aria-labelledby="labelId"
      class="w-40"
      @update:model-value="setValue"
    />
    <span class="w-14 text-right text-xs tabular-nums text-muted-foreground">
      {{ value }}{{ props.unit }}
    </span>
  </div>
</template>
