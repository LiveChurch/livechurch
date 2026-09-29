<script setup lang="ts">
import ColorPicker from "primevue/colorpicker";
import { ColorUtils } from "@/core/utils/ColorUtils";
import { cn } from "@/core/utils/ClassNameUtils";

/** Color picker that reads and emits hexadecimal with `#` (ColorPicker uses hex without `#`). */
const props = defineProps<{
  label: string;
  id: string;
  modelValue: string;
  /** Shows the color panel directly on screen, without opening a popup. */
  inline?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const setColor = (value: unknown) => {
  if (typeof value === "string") emit("update:modelValue", `#${value}`);
};
</script>

<template>
  <div :class="cn('flex gap-2', props.inline ? 'flex-col-reverse items-start' : 'items-center')">
    <ColorPicker
      :model-value="ColorUtils.toPickerHex(props.modelValue)"
      format="hex"
      :inline="props.inline"
      :input-id="props.id"
      :aria-labelledby="`${props.id}-label`"
      @update:model-value="setColor"
    />
    <label :id="`${props.id}-label`" :for="props.id" class="text-sm font-medium text-muted-foreground">
      {{ props.label }}
    </label>
  </div>
</template>
