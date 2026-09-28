import { I18n } from "@/core/i18n/I18n";
import { DateUtils } from "@/core/utils/DateUtils";

/**
 * Port of src/modals/calendar/recurrenceOptions.ts.
 * The `@internationalized/date` conversions (CalendarDate/DateValue) were
 * replaced by ISO `yyyy-MM-dd` strings (persistence format); PrimeVue's
 * `DatePicker` uses `Date` as its model — the string↔Date conversion
 * lives in the fields that use it (EndDateField etc.).
 */

export function toISODate(value: Date | string): string {
  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(
    value.getDate(),
  ).padStart(2, "0")}`;
}

/** Converts an ISO `yyyy-MM-dd` (or `yyyy/MM/dd`) string into a local Date. */
export function fromISODate(value: string): Date {
  const [year, month, day] = value.split(/[-/]/).map(Number);
  return new Date(year, month - 1, day);
}

/** Translated recurrence options; functions to follow the current language. */
export const RecurrenceOptions = {
  weekDayInitials: () => DateUtils.weekdayNames("narrow"),

  recurrence: () => [
    { value: "none", label: I18n.t("modals.calendar.recurrenceNone") },
    { value: "weekly", label: I18n.t("modals.calendar.recurrenceWeekly") },
    { value: "monthly", label: I18n.t("modals.calendar.recurrenceMonthly") },
  ],

  weekNumber: () =>
    ["first", "second", "third", "fourth", "last"].map((name, index) => ({
      value: index + 1,
      label: I18n.t(`modals.calendar.weekNumber.${name}`),
    })),

  weekday: () => DateUtils.weekdayNames("long").map((label, value) => ({ value, label })),
};
