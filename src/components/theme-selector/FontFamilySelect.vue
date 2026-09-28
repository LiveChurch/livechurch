<script setup lang="ts">
import { computed, onMounted } from "vue";
import PrimeSelect from "primevue/select";
import { useSystemFonts } from "@/core/composables/useSystemFonts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
  fallbackOptions: string[];
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const { fonts, loading, load } = useSystemFonts();

onMounted(load);

const options = computed(() =>
  fonts.value.length > 0 ? fonts.value : props.fallbackOptions,
);
</script>

<template>
  <div class="w-full">
    <PrimeSelect
      :model-value="props.modelValue"
      :options="options"
      filter
      :filter-placeholder="t('components.themeSelector.searchFont')"
      :placeholder="loading ? 'Carregando fontes do sistema...' : 'Selecione uma fonte'"
      :aria-label="t('components.themeSelector.font')"
      class="w-full text-sm"
      :pt="{
        root: { class: 'bg-transparent' },
        overlay: { class: 'rounded-lg border border-border bg-surface text-surface-foreground shadow-2xl' },
        list: { class: 'p-1' },
        emptyMessage: { class: 'text-muted-foreground' },
      }"
      @update:model-value="(value: string) => emit('update:modelValue', value)"
    >
      <template #value="{ value, placeholder }">
        <span v-if="value" :style="{ fontFamily: value }">{{ value }}</span>
        <span v-else class="text-muted-foreground">{{ placeholder }}</span>
      </template>
      <template #option="{ option }">
        <span :style="{ fontFamily: option }">{{ option }}</span>
      </template>
    </PrimeSelect>
  </div>
</template>
