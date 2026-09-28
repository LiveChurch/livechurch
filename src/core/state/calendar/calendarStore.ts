import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { CalendarEvent, DateRange } from "@/core/types/calendar";
import { StorageService } from "@/core/services/StorageService";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";
import { DateUtils } from "@/core/utils/DateUtils";
import { expandEventInstances } from "./eventRecurrence";

/**
 * Calendar store (replaces MobX's CalendarStore + React's CalendarContext).
 * Keeps the `{ state, actions }` API to ease porting.
 */
export const useCalendarStore = defineStore("calendar", () => {
  const state = reactive({
    events: StorageService.readJson<CalendarEvent[]>(
      StorageService.keys.calendarEvents,
      [],
    ),
  });

  const actions = {
    addEvent(event: Omit<CalendarEvent, "id">) {
      state.events.push({ ...event, id: uuidv4() });
    },

    updateEvent(id: string, updates: Partial<CalendarEvent>) {
      const event = state.events.find((item) => item.id === id);
      if (event) Object.assign(event, updates);
    },

    deleteEvent(id: string) {
      state.events = state.events.filter((item) => item.id !== id);
    },

    /** Removes only this occurrence, keeping the other dates of the recurrence. */
    deleteEventInstance(id: string, instanceDate: Date) {
      const event = state.events.find((item) => item.id === id);
      if (!event) return;
      const dateKey = DateUtils.toDateKey(instanceDate);
      event.excludedDates = [...(event.excludedDates ?? []), dateKey];
    },

    /** Ends the recurrence before this occurrence, removing it and the future ones. */
    deleteEventFromDate(id: string, instanceDate: Date) {
      const event = state.events.find((item) => item.id === id);
      if (!event) return;

      const startDate = DateUtils.startOfDay(DateUtils.parseDate(event.date));
      if (DateUtils.startOfDay(instanceDate).getTime() <= startDate.getTime()) {
        actions.deleteEvent(id);
        return;
      }

      const dayBefore = new Date(instanceDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      event.endDate = DateUtils.toDateKey(dayBefore);
    },

    getEventsInRange(range: DateRange) {
      return expandEventInstances(state.events, range);
    },
  };

  // Replaces the persistence `reaction` that existed in the MobX module. Debounced
  // so it does not rewrite the whole calendar on every reactive change.
  const debouncedPersist = PersistenceUtils.debouncePersist(() => {
    StorageService.writeJson(
      StorageService.keys.calendarEvents,
      JSON.parse(JSON.stringify(state.events)),
    );
  });
  watch(
    () => state.events.map((event) => JSON.stringify(event)).join("|"),
    () => debouncedPersist(),
  );

  return { state, actions };
});
