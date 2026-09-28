<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import type { EventFormData } from "./types";
import { RecurrenceOptions } from "./recurrenceOptions";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/calendar/WeeklyDaysField.tsx.
 * React's circular buttons → round buttons (ToggleButton-like) with
 * PrimeVue's `Button`.
 */
const props = defineProps<{
  form: EventFormData;
}>();

const dayOptions = computed(() =>
  RecurrenceOptions.weekDayInitials().map((label, index) => ({ label, value: index })),
);

function toggleDay(value: number) {
  const days = props.form.weekDays.includes(value)
    ? props.form.weekDays.filter((day) => day !== value)
    : [...props.form.weekDays, value];
  props.form.weekDays = days.sort((a, b) => a - b);
}
</script>

<template>
  <div class="rounded-lg bg-surface/70 p-5">
    <div class="mb-2 text-sm font-medium text-surface-foreground">{{ t('modals.calendar.weekDays') }}</div>
    <div class="flex justify-between gap-1">
      <Button
        v-for="option in dayOptions"
        :key="option.value"
        type="button"
        variant="text"
        severity="secondary"
        rounded
        :aria-pressed="props.form.weekDays.includes(option.value)"
        :label="option.label"
        :class="
          cn(
            'h-9 w-9 shrink-0 rounded-full p-0 text-xs font-medium',
            props.form.weekDays.includes(option.value)
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'text-muted-foreground hover:bg-surface-light/60 hover:text-surface-foreground',
          )
        "
        @click="toggleDay(option.value)"
      />
    </div>
  </div>
</template>
