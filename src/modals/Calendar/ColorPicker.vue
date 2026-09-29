<script setup lang="ts">
import Button from "primevue/button";
import { cn } from "@/core/utils/ClassNameUtils";
import type { EventFormData } from "./types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/calendar/ColorPicker.tsx.
 * React already uses circular buttons (not a native color input),
 * so the behavior is replicated with `Button` + Tailwind.
 */
const props = defineProps<{
  form: EventFormData;
}>();

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
</script>

<template>
  <div>
    <div class="mb-2 text-sm font-medium text-surface-foreground">{{ t('components.themeSelector.color') }}</div>
    <div class="flex items-center gap-2">
      <Button
        v-for="c in COLORS"
        :key="c"
        type="button"
        variant="text"
        rounded
        :aria-label="`Cor ${c}`"
        class="h-6 w-6 shrink-0 rounded-full p-0 ring-1 ring-border transition-transform hover:scale-110"
        :class="cn(props.form.color === c && 'ring-2 ring-foreground ring-offset-2 scale-110')"
        :style="{ backgroundColor: c }"
        @click="props.form.color = c"
      />
    </div>
  </div>
</template>
