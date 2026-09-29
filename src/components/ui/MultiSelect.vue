<script setup lang="ts" generic="T extends string | number">
import MultiSelect from "primevue/multiselect";

/**
 * Wrapper of PrimeVue's `MultiSelect` with the same look as `Select.vue`:
 * list of labeled options + selected values (v-model).
 */
defineProps<{
  modelValue: T[];
  options: { label: string; value: T }[];
  placeholder?: string;
  label?: string;
  hint?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: T[]): void;
}>();
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="mb-1.5 block text-sm font-medium text-muted-foreground"
    >
      {{ label }}
    </label>

    <MultiSelect
      :model-value="modelValue"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :show-toggle-all="false"
      display="chip"
      class="w-full text-sm"
      :pt="{
        root: { class: 'bg-transparent' },
        overlay: { class: 'rounded-lg border border-border bg-surface text-surface-foreground shadow-2xl' },
        list: { class: 'p-1' },
        emptyMessage: { class: 'text-muted-foreground' },
      }"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <small v-if="hint" class="mt-1 block text-xs text-muted-foreground">
      {{ hint }}
    </small>
  </div>
</template>
