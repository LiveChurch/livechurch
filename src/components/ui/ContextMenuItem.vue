<script setup lang="ts">
// API: props { icon?: string; variant?: "default" | "danger"; disabled?: boolean },
// emit "click", default slot for the label.
import AppIcon from "@/components/ui/AppIcon.vue";
import { cn } from "@/core/utils/ClassNameUtils";

/**
 * Row item of ContextMenu.vue (port of React's `ContextMenuItem`).
 * The click emits "click" (with stopPropagation, as in the original); whoever
 * controls closing the menu is the parent (v-model).
 */
withDefaults(
  defineProps<{
    icon?: string;
    variant?: "default" | "danger";
    disabled?: boolean;
  }>(),
  { icon: undefined, variant: "default", disabled: false },
);

const emit = defineEmits<{
  (event: "click"): void;
}>();
</script>

<template>
  <div
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    :class="
      cn(
        'flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors duration-150',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:bg-surface-light/60',
        variant === 'danger' ? 'text-danger' : 'text-surface-foreground',
      )
    "
    @click="
      (event: MouseEvent) => {
        event.stopPropagation();
        if (!disabled) emit('click');
      }
    "
    @keydown="
      (event: KeyboardEvent) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          emit('click');
        }
      }
    "
  >
    <span v-if="icon" class="flex h-4 w-4 shrink-0 items-center justify-center">
      <AppIcon :name="icon" size="14px" />
    </span>
    <span class="flex-1 text-left"><slot /></span>
  </div>
</template>
