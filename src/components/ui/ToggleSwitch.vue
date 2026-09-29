<script setup lang="ts">
import PrimeToggleSwitch from "primevue/toggleswitch";

const props = defineProps<{
  modelValue: boolean;
  label?: string;
  id?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <label v-if="props.label" :for="props.id" class="text-xs text-foreground">{{ props.label }}</label>
    <PrimeToggleSwitch
      :model-value="props.modelValue"
      :input-id="props.id"
      @update:model-value="(value: boolean) => emit('update:modelValue', value)"
    />
  </div>
</template>
