import type { RecurrenceType } from "@/core/types/calendar";

/** Porta src/modals/calendar/types.ts */
export interface EventFormData {
  title: string;
  date: Date;
  time: string;
  color: string;
  background: string;
  recurrence: RecurrenceType;
  weekDays: number[];
  monthlyType: "date" | "weekday";
  monthDay?: number;
  weekNumber?: number;
  weekday?: number;
  hasEndDate: boolean;
  endDate?: string;
}

// NOTE (Vue): the old `EventFormProps` is no longer needed — EventFormModal
// is a PrimeVue <Dialog> controlled by the modal's shared state
// (`showEventForm`/`selectedDate`/`editingEvent` in useCalendarModal.ts), and
// EventForm receives `initialDate`/`editingEvent` as props and emits `save`/`cancel`.
