export type RecurrenceType = "none" | "weekly" | "monthly";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  color?: string;
  /** Event background image (data URL), with no defined use yet. */
  background?: string;
  recurrence: RecurrenceType;
  weekDays?: number[];
  monthlyType?: "date" | "weekday";
  monthDay?: number;
  weekNumber?: number;
  weekday?: number;
  endDate?: string | null;
  /** Dates (yyyy-MM-dd) of individual occurrences excluded from the recurrence. */
  excludedDates?: string[];
  instanceDate?: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}
