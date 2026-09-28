import { inject, provide, reactive, type InjectionKey } from "vue";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { CalendarEvent } from "@/core/types/calendar";

/**
 * Port of src/modals/calendar/store.ts (MobX `useLocalObservable(createCalendarStore)`).
 * The modal's local state lives in CalendarModal.vue and is shared with the
 * children via provide/inject.
 */
export interface CalendarModalApi {
  currentDate: Date;
  selectedDate: Date | null;
  showEventForm: boolean;
  editingEvent: CalendarEvent | null;
  readonly daysInMonth: Date[];
  setCurrentDate(date: Date): void;
  setSelectedDate(date: Date | null): void;
  setShowEventForm(show: boolean): void;
  openEventForm(date: Date): void;
  openEditForm(event: CalendarEvent): void;
  closeEventForm(): void;
  nextMonth(): void;
  prevMonth(): void;
  goToday(): void;
}

const CALENDAR_MODAL_KEY: InjectionKey<CalendarModalApi> = Symbol("CalendarModal");

export function createCalendarModalStore(): CalendarModalApi {
  // Same technique as themeStore: getters defined directly on the reactive object
  // (avoids the circular storeDef/state initialization that breaks TS inference).
  const state = reactive({
    currentDate: new Date(),
    selectedDate: null as Date | null,
    showEventForm: false,
    editingEvent: null as CalendarEvent | null,

    get daysInMonth(): Date[] {
      const start = startOfWeek(startOfMonth(this.currentDate), {
        weekStartsOn: 0,
      });
      const end = endOfWeek(endOfMonth(this.currentDate), { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    },

    setCurrentDate(date: Date) {
      state.currentDate = date;
    },
    setSelectedDate(date: Date | null) {
      state.selectedDate = date;
    },
    setShowEventForm(show: boolean) {
      state.showEventForm = show;
    },
    openEventForm(date: Date) {
      state.editingEvent = null;
      state.selectedDate = date;
      state.showEventForm = true;
    },
    openEditForm(event: CalendarEvent) {
      state.editingEvent = event;
      state.selectedDate = event.instanceDate ?? new Date(event.date);
      state.showEventForm = true;
    },
    closeEventForm() {
      state.showEventForm = false;
      state.selectedDate = null;
      state.editingEvent = null;
    },
    nextMonth() {
      state.currentDate = addMonths(state.currentDate, 1);
    },
    prevMonth() {
      state.currentDate = subMonths(state.currentDate, 1);
    },
    goToday() {
      state.currentDate = new Date();
    },
  }) as unknown as CalendarModalApi;

  return state;
}

export function provideCalendarModal(api: CalendarModalApi): CalendarModalApi {
  provide(CALENDAR_MODAL_KEY, api);
  return api;
}

export function useCalendarModal(): CalendarModalApi {
  const api = inject(CALENDAR_MODAL_KEY, null);
  if (!api) {
    throw new Error("useCalendarModal deve ser usado dentro de CalendarModal.vue");
  }
  return api;
}
