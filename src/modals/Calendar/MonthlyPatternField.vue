<script setup lang="ts">
import { computed } from "vue";
import RadioButton from "primevue/radiobutton";
import type { EventFormData } from "./types";
import Select from "@/components/ui/Select.vue";
import { RecurrenceOptions } from "./recurrenceOptions";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/calendar/MonthlyPatternField.tsx.
 * React's RadioGroup/Select → PrimeVue's `RadioButton`/`Select` wrapper.
 */
const props = defineProps<{
  form: EventFormData;
}>();

const dateLabel = computed(() => t("modals.calendar.monthlyOnDay", { day: props.form.monthDay ?? props.form.date.getDate() }));

const weekNumberOptions = computed(() => RecurrenceOptions.weekNumber());
const weekdayOptions = computed(() => RecurrenceOptions.weekday());

const weekNumber = computed({
  get: () => props.form.weekNumber ?? 1,
  set: (value: number) => {
    props.form.weekNumber = value;
    props.form.monthlyType = "weekday";
  },
});

const weekday = computed({
  get: () => props.form.weekday ?? 0,
  set: (value: number) => {
    props.form.weekday = value;
    props.form.monthlyType = "weekday";
  },
});
</script>

<template>
  <div class="space-y-3 rounded-lg bg-surface/70 p-8">
    <div class="flex flex-col gap-2">
      <label for="monthly-date" class="flex cursor-pointer items-center gap-2">
        <RadioButton v-model="form.monthlyType" value="date" input-id="monthly-date" />
        <span>{{ dateLabel }}</span>
      </label>

      <div class="flex flex-col gap-2">
        <label for="monthly-weekday" class="flex cursor-pointer items-center gap-2">
          <RadioButton v-model="form.monthlyType" value="weekday" input-id="monthly-weekday" />
          <span>{{ t('modals.calendar.monthlyOnWeekday') }}</span>
        </label>
        <div class="flex gap-2 pl-7">
          <div class="w-32">
            <Select v-model="weekNumber" :options="weekNumberOptions" />
          </div>
          <div class="w-32">
            <Select v-model="weekday" :options="weekdayOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
