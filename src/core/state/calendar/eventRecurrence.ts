import type { CalendarEvent, DateRange } from "@/core/types/calendar";
import { DateUtils } from "@/core/utils/DateUtils";

function eventStartDate(event: CalendarEvent) {
  return DateUtils.startOfDay(DateUtils.parseDate(event.date));
}

function eventEndDate(event: CalendarEvent): Date | null {
  if (!event.endDate) return null;
  const [year, month, day] = event.endDate.split("-").map(Number);
  return DateUtils.endOfDay(new Date(year, month - 1, day));
}

function pushInstance(
  instances: CalendarEvent[],
  event: CalendarEvent,
  instanceDate: Date,
  rangeStart: Date,
  rangeEnd: Date,
) {
  if (instanceDate < rangeStart || instanceDate > rangeEnd) return;
  if (event.excludedDates?.includes(DateUtils.toDateKey(instanceDate))) return;
  instances.push({ ...event, instanceDate: new Date(instanceDate) });
}

function expandWeekly(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
  instances: CalendarEvent[],
) {
  const limit = eventEndDate(event);
  const start = eventStartDate(event);
  const current = rangeStart > start ? new Date(rangeStart) : new Date(start);

  while (current <= rangeEnd) {
    if (limit && current > limit) break;
    if (event.weekDays?.includes(current.getDay())) {
      pushInstance(instances, event, current, rangeStart, rangeEnd);
    }
    current.setDate(current.getDate() + 1);
  }
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  weekNumber: number,
): Date | null {
  const days: Date[] = [];
  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month, day);
    if (date.getMonth() !== month) break;
    if (date.getDay() === weekday) days.push(date);
  }
  if (weekNumber <= days.length) return days[weekNumber - 1];
  if (weekNumber === 5) return days[days.length - 1] ?? null;
  return null;
}

function monthlyInstanceDate(event: CalendarEvent, cursor: Date): Date | null {
  if (event.monthlyType === "date" && event.monthDay) {
    const lastDay = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      0,
    ).getDate();
    if (event.monthDay > lastDay) return null;
    return new Date(cursor.getFullYear(), cursor.getMonth(), event.monthDay);
  }
  if (event.monthlyType === "weekday" && event.weekNumber && event.weekday !== undefined) {
    return nthWeekdayOfMonth(cursor.getFullYear(), cursor.getMonth(), event.weekday, event.weekNumber);
  }
  return new Date(cursor);
}

function expandMonthly(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
  instances: CalendarEvent[],
) {
  const limit = eventEndDate(event);
  const start = eventStartDate(event);
  const cursor = new Date(start);
  if (rangeStart > cursor) {
    cursor.setFullYear(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  }

  while (cursor <= rangeEnd) {
    if (limit && cursor > limit) break;
    const instanceDate = monthlyInstanceDate(event, cursor);
    if (instanceDate) {
      instanceDate.setHours(0, 0, 0, 0);
      if (instanceDate >= start && (!limit || instanceDate <= limit)) {
        pushInstance(instances, event, instanceDate, rangeStart, rangeEnd);
      }
    }
    cursor.setMonth(cursor.getMonth() + 1);
    cursor.setDate(1);
  }
}

export function expandEventInstances(
  events: CalendarEvent[],
  range: DateRange,
): CalendarEvent[] {
  const rangeStart = DateUtils.startOfDay(new Date(range.start));
  const rangeEnd = DateUtils.endOfDay(new Date(range.end));
  const instances: CalendarEvent[] = [];

  for (const event of events) {
    if (event.recurrence === "none") {
      pushInstance(instances, event, eventStartDate(event), rangeStart, rangeEnd);
      continue;
    }
    if (event.recurrence === "weekly" && event.weekDays?.length) {
      expandWeekly(event, rangeStart, rangeEnd, instances);
      continue;
    }
    if (event.recurrence === "monthly") {
      expandMonthly(event, rangeStart, rangeEnd, instances);
    }
  }

  return instances.sort((a, b) => {
    const diff = a.instanceDate!.getTime() - b.instanceDate!.getTime();
    return diff !== 0 ? diff : a.time.localeCompare(b.time);
  });
}
