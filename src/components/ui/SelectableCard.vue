<script setup lang="ts">
import { cn } from "@/core/utils/ClassNameUtils";

const props = withDefaults(defineProps<{
  label?: string;
  selected: boolean;
  disabled?: boolean;
}>(), { disabled: false });

const emit = defineEmits<{ select: [] }>();

const select = () => {
  if (!props.disabled) emit("select");
};
</script>

<template>
  <div
    role="button"
    :tabindex="props.disabled ? -1 : 0"
    :aria-pressed="props.selected"
    :aria-disabled="props.disabled"
    :class="
      cn(
        'group flex min-w-0 flex-col gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand/60',
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )
    "
    @click="select"
    @keydown.enter.prevent="select"
    @keydown.space.prevent="select"
  >
    <div
      :class="
        cn(
          'relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-media transition-colors',
          props.selected
            ? 'border-brand ring-2 ring-brand/50'
            : 'border-border hover:border-muted-foreground',
        )
      "
    >
      <slot />
    </div>
    <span
      v-if="props.label"
      :class="
        cn(
          'truncate text-center text-xs font-medium',
          props.selected ? 'text-brand' : 'text-muted-foreground',
        )
      "
    >
      {{ props.label }}
    </span>
  </div>
</template>
