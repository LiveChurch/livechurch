<script setup lang="ts">
import InputText from "primevue/inputtext";
import SearchIcon from "@primevue/icons/search";
import VoiceButton from "./VoiceButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
  query: string;
}>();

const emit = defineEmits<{
  (event: "update:query", value: string): void;
  (event: "focus"): void;
}>();

</script>

<template>
  <div class="relative">
    <SearchIcon
      class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground"
      aria-hidden="true"
    />
    <InputText
      ref="inputRef"
      :model-value="query"
      :placeholder="t('control.search.placeholder')"
      :aria-label="t('control.search.label')"
      class="h-9 w-full rounded-md border-border bg-surface-light/30 pl-9 pr-9 text-sm text-surface-foreground placeholder:text-muted-foreground hover:bg-surface-light/50"
      @update:model-value="
        (value: string | number | undefined) => emit('update:query', String(value ?? ''))
      "
      @focus="emit('focus')"
    />
    <VoiceButton @transcript="emit('update:query', $event)" />
  </div>
</template>
