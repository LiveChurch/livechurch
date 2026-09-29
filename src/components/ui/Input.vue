<script setup lang="ts">
// API: modelValue?: string | number (v-model) + emit 'update:modelValue'.
import { ref } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Simple text input (wrapper of PrimeVue's `InputText`/`Textarea`),
 * equivalent to the re-export `export { Input } from "@/components/base/input/input"`
 * from React. Keeps the original public surface:
 *  - props: modelValue?: string | number; type?: string; placeholder?: string;
 *    label?: string; disable?: boolean; maxlength?: number; clearable?: boolean;
 *    autofocus?: boolean
 *  - emits: update:modelValue
 *  - slots: suffix (action at the right corner of the field)
 *  - extra attrs/classes fall through to the input (default fallthrough).
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    type?: string;
    placeholder?: string;
    label?: string;
    disable?: boolean;
    maxlength?: number;
    /** Visible rows (only for `type="textarea"`). */
    rows?: number;
    clearable?: boolean;
    /** PrimeIcons class shown at the left of the field (e.g. `pi-search`). */
    icon?: string;
    autofocus?: boolean;
    id?: string;
  }>(),
  { modelValue: "", type: "text" },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number | null): void;
}>();

const inputRef = ref<{ $el: HTMLElement } | null>(null);

const focus = () => {
  (inputRef.value?.$el as HTMLInputElement | HTMLTextAreaElement | undefined)?.focus();
};

defineExpose({ focus });
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-muted-foreground"
    >
      {{ label }}
    </label>

    <div class="relative">
      <Textarea
        v-if="type === 'textarea'"
        :id="id"
        ref="inputRef"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disable"
        :maxlength="maxlength"
        :rows="rows"
        :autofocus="autofocus"
        :class="['h-full w-full', $slots.suffix ? 'pr-9' : '']"
        @update:model-value="
          (value: string | undefined) => emit('update:modelValue', value ?? null)
        "
      />
      <InputText
        v-else
        :id="id"
        ref="inputRef"
        :type="type"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disable"
        :maxlength="maxlength"
        :autofocus="autofocus"
        :class="[
          'w-full',
          (clearable && modelValue) || $slots.suffix ? 'pr-9' : '',
          icon ? 'pl-9' : '',
        ]"
        @update:model-value="
          (value: string | undefined) => emit('update:modelValue', value ?? null)
        "
      />
      <i
        v-if="icon && type !== 'textarea'"
        :class="['pi', icon]"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Button
        v-if="clearable && modelValue"
        type="button"
        variant="text"
        severity="secondary"
        icon="pi pi-times"
        :aria-label="t('components.input.clear')"
        class="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-1 text-muted-foreground hover:text-surface-foreground"
        @click="emit('update:modelValue', '')"
      />
      <!-- Extra action at the right corner of the field (e.g. switch to multiple lines). -->
      <div v-if="$slots.suffix" class="absolute right-1 top-1 flex">
        <slot name="suffix" />
      </div>
    </div>
  </div>
</template>
