<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import Select from "@/components/ui/Select.vue";
import type { RecurrenceType } from "@/core/types/calendar";
import type { EventFormData } from "./types";
import { RecurrenceOptions } from "./recurrenceOptions";
import WeeklyDaysField from "./WeeklyDaysField.vue";
import MonthlyPatternField from "./MonthlyPatternField.vue";
import EndDateField from "./EndDateField.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/calendar/RecurrenceSection.tsx */
const props = defineProps<{
  form: EventFormData;
}>();

const recurrenceOptions = computed(() => RecurrenceOptions.recurrence());

const recurrence = computed({
  get: () => props.form.recurrence as string,
  set: (value: string) => {
    props.form.recurrence = value as RecurrenceType;
  },
});
</script>

<template>
  <div class="space-y-3 border-t border-border pt-3">
    <div class="flex items-center gap-2">
      <AppIcon name="repeat" size="16px" class="text-muted-foreground" />
      <div class="relative w-48">
        <Select
          v-model="recurrence"
          :options="recurrenceOptions"
          :placeholder="t('modals.calendar.repetition')"
        />
      </div>
    </div>

    <Transition name="field">
      <WeeklyDaysField v-if="form.recurrence === 'weekly'" :form="form" />
    </Transition>
    <Transition name="field">
      <MonthlyPatternField v-if="form.recurrence === 'monthly'" :form="form" />
    </Transition>
    <Transition name="field">
      <EndDateField v-if="form.recurrence === 'weekly' || form.recurrence === 'monthly'" :form="form" />
    </Transition>
  </div>
</template>

<style scoped>
/* Substitui `animate-in slide-in-from-top-2 duration-200` (tailwindcss-animate). */
.field-enter-active,
.field-leave-active {
  transition: all 0.2s ease;
}
.field-enter-from,
.field-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
