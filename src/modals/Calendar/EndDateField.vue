<script setup lang="ts">
import { DateLocales } from "@/core/i18n/DateLocales";
import { computed } from "vue";
import Checkbox from "primevue/checkbox";
import DatePicker from "primevue/datepicker";
import type { EventFormData } from "./types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/calendar/EndDateField.tsx.
 * react-aria DatePicker → PrimeVue's <DatePicker> (Date model).
 */
const props = defineProps<{
  form: EventFormData;
}>();

const minDate = new Date();
minDate.setHours(0, 0, 0, 0);

const endDate = computed({
  get: () => {
    if (!props.form.endDate) return null;
    const [y, m, d] = props.form.endDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  },
  set: (value: Date | null) => {
    if (!value) {
      props.form.endDate = "";
      return;
    }
    const pad = (n: number) => String(n).padStart(2, "0");
    props.form.endDate = `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  },
});
</script>

<template>
  <div class="mt-4 flex items-center gap-3 pl-1">
    <label for="has-end-date" class="flex cursor-pointer items-center gap-2">
      <Checkbox v-model="form.hasEndDate" :binary="true" input-id="has-end-date" />
      <span>{{ t('modals.calendar.endsOn') }}</span>
    </label>

    <div v-if="form.hasEndDate" class="relative flex-1">
      <DatePicker
        v-model="endDate"
        :min-date="minDate"
        :date-format="DateLocales.datePickerFormat()"
        :placeholder="t('modals.calendar.selectDate')"
        show-icon
        :aria-label="t('modals.calendar.endDate')"
        fluid
      />
    </div>
  </div>
</template>
