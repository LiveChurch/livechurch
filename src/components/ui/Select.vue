<script setup lang="ts">
// API: modelValue (string | number | null, v-model) + options {label,value}[] + emit 'update:modelValue'.
import { computed } from "vue";
import Select from "primevue/select";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Wrapper of PrimeVue's `Select` with the API of `src/components/ui/select.tsx`
 * (React): list of labeled options + controlled value.
 *
 * Public API:
 *  - props:
 *      modelValue?: string | number | null      (v-model)
 *      options: Array<{ label: string; value: string | number } | string>
 *      placeholder?: string (default "Select...")
 *      label?: string; hint?: string
 *      disable?: boolean; isInvalid?: boolean
 *      filter?: boolean (enables searching within the options list)
 *  - emits: update:modelValue (value: string | number)
 *  - attrs/class fall through to the Select.
 */
interface SelectOption {
  label: string;
  value: string | number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    options: Array<SelectOption | string>;
    placeholder?: string;
    label?: string;
    hint?: string;
    disable?: boolean;
    isInvalid?: boolean;
    filter?: boolean;
    filterPlaceholder?: string;
  }>(),
  { modelValue: null },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

const normalizedOptions = computed<SelectOption[]>(() =>
  props.options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  ),
);
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="mb-1.5 block text-sm font-medium text-muted-foreground"
    >
      {{ label }}
    </label>

    <Select
      :model-value="modelValue"
      :options="normalizedOptions"
      option-label="label"
      option-value="value"
      :placeholder="placeholder ?? t('common.actions.select')"
      :disabled="disable"
      :invalid="isInvalid"
      :filter="filter"
      :filter-placeholder="filterPlaceholder ?? t('common.actions.search')"
      class="w-full text-sm"
      :pt="{
        root: { class: 'bg-transparent' },
        overlay: { class: 'rounded-lg border border-border bg-surface text-surface-foreground shadow-2xl' },
        list: { class: 'p-1' },
        emptyMessage: { class: 'text-muted-foreground' },
      }"
      @update:model-value="
        (value: string | number | null | undefined) => {
          if (value !== null && value !== undefined) emit('update:modelValue', value);
        }
      "
    />

    <small v-if="hint" class="mt-1 block text-xs text-muted-foreground">
      {{ hint }}
    </small>
  </div>
</template>
