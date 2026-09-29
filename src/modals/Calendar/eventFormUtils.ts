import type { CalendarEvent } from "@/core/types/calendar";
import type { EventFormData } from "./types";

/** Port of src/modals/calendar/eventFormUtils.ts (no changes — already uses a plain values object). */

function parseDateString(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function buildFormDefaults(
  editingEvent: CalendarEvent | null | undefined,
  initialDate: Date,
): EventFormData {
  const base: EventFormData = {
    title: "",
    date: initialDate,
    time: "19:00",
    color: "#3b82f6",
    background: "",
    recurrence: "none",
    weekDays: [initialDate.getDay()],
    monthlyType: "date",
    monthDay: initialDate.getDate(),
    weekNumber: 1,
    weekday: initialDate.getDay(),
    hasEndDate: false,
    endDate: "",
  };

  if (!editingEvent) return base;

  return {
    title: editingEvent.title,
    date: editingEvent.instanceDate ?? parseDateString(editingEvent.date),
    time: editingEvent.time,
    color: editingEvent.color || base.color,
    background: editingEvent.background ?? base.background,
    recurrence: editingEvent.recurrence,
    weekDays: editingEvent.weekDays ?? base.weekDays,
    monthlyType: editingEvent.monthlyType ?? "date",
    monthDay: editingEvent.monthDay ?? base.monthDay,
    weekNumber: editingEvent.weekNumber ?? base.weekNumber,
    weekday: editingEvent.weekday ?? base.weekday,
    hasEndDate: Boolean(editingEvent.endDate),
    endDate: editingEvent.endDate ?? "",
  };
}

export function nthWeekdayOfMonth(date: Date): number {
  const weekday = date.getDay();
  let count = 0;
  for (let day = 1; day <= date.getDate(); day++) {
    if (new Date(date.getFullYear(), date.getMonth(), day).getDay() === weekday) {
      count++;
    }
  }
  return count;
}

export type SubmissionEvent = Omit<CalendarEvent, "id">;

export function normalizeSubmission(
  data: EventFormData,
  formattedDate: string,
): SubmissionEvent {
  const isWeekly = data.recurrence === "weekly";
  const isMonthly = data.recurrence === "monthly";
  const isMonthlyWeekday = isMonthly && data.monthlyType === "weekday";

  return {
    title: data.title,
    date: formattedDate,
    time: data.time,
    color: data.color,
    background: data.background || undefined,
    recurrence: data.recurrence,
    weekDays: isWeekly ? data.weekDays : undefined,
    monthlyType: isMonthly ? data.monthlyType : undefined,
    monthDay: isMonthly && data.monthlyType === "date" ? data.monthDay : undefined,
    weekNumber: isMonthlyWeekday ? data.weekNumber : undefined,
    weekday: isMonthlyWeekday ? data.weekday : undefined,
    endDate: data.hasEndDate && data.endDate ? data.endDate : null,
  };
}
