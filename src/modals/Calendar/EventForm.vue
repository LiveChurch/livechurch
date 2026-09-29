<script setup lang="ts">
import { DateLocales } from "@/core/i18n/DateLocales";
import { computed, reactive, watch } from "vue";
import { format } from "date-fns";
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import type { CalendarEvent } from "@/core/types/calendar";
import { buildFormDefaults, normalizeSubmission, nthWeekdayOfMonth } from "./eventFormUtils";
import type { SubmissionEvent } from "./eventFormUtils";
import type { EventFormData } from "./types";
import ColorPicker from "./ColorPicker.vue";
import BackgroundPicker from "./BackgroundPicker.vue";
import RecurrenceSection from "./RecurrenceSection.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/calendar/EventForm.tsx.
 * react-hook-form → `reactive` values object + manual validation (pt-BR messages).
 */
const props = defineProps<{
  initialDate: Date;
  editingEvent?: CalendarEvent | null;
}>();

const emit = defineEmits<{
  save: [event: SubmissionEvent];
  cancel: [];
}>();

const form = reactive<EventFormData>(
  buildFormDefaults(props.editingEvent, props.initialDate),
);

const errors = reactive<{ title?: string; time?: string }>({});

/** Event date as a Date (DatePicker model), synced with form.date. */
const dateModel = computed({
  get: () => form.date,
  set: (value: Date | null) => {
    if (value) form.date = value;
  },
});

const minDate = new Date();
minDate.setHours(0, 0, 0, 0);

// Equivalent to React's useEffect with watch("date"/"recurrence"/"weekDays").
function syncRecurrenceToSelectedDate() {
  const date = form.date;
  if (!date) return;
  const day = date.getDate();
  const weekday = date.getDay();

  if (form.recurrence === "monthly") {
    form.monthDay = day;
    form.weekday = weekday;
    form.weekNumber = nthWeekdayOfMonth(date);
  } else if (form.recurrence === "weekly" && !form.weekDays.includes(weekday)) {
    form.weekDays = [weekday];
  }
}

watch(
  [() => form.date, () => form.recurrence, () => form.weekDays],
  syncRecurrenceToSelectedDate,
  { immediate: true },
);

const onSubmit = () => {
  errors.title = form.title.trim() ? undefined : t("modals.calendar.titleRequired");
  if (errors.title) return;
  emit("save", normalizeSubmission(form, format(form.date, "yyyy-MM-dd")));
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-muted-foreground">
        {{ t('modals.calendar.eventTitle') }}
      </label>
      <InputText
        v-model="form.title"
        :placeholder="t('modals.calendar.eventTitleExample')"
        :invalid="Boolean(errors.title)"
        class="w-full"
        autofocus
      />
      <p v-if="errors.title" class="mt-1 text-xs text-danger">{{ errors.title }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-muted-foreground">
          {{ t('modals.calendar.startDate') }}
        </label>
        <DatePicker
          v-model="dateModel"
          :min-date="minDate"
          :date-format="DateLocales.datePickerFormat()"
          show-icon
          input-id="event-date"
          :aria-label="t('modals.calendar.eventDate')"
          fluid
        />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-muted-foreground">
          {{ t('modals.calendar.time') }}
        </label>
        <InputText v-model="form.time" type="time" class="w-full" :invalid="Boolean(errors.time)" />
        <p v-if="errors.time" class="mt-1 text-xs text-danger">{{ errors.time }}</p>
      </div>
    </div>

    <ColorPicker :form="form" />
    <BackgroundPicker :form="form" />
    <RecurrenceSection :form="form" />

    <div class="flex justify-end gap-2 pt-4">
      <Button
        variant="text"
        severity="secondary"
        :label="t('common.actions.cancel')"
        type="button"
        @click="emit('cancel')"
      />
      <Button
        :label="editingEvent ? t('modals.calendar.saveChanges') : t('modals.calendar.saveEvent')"
        type="submit"
      />
    </div>
  </form>
</template> 
