import type { CalendarEvent } from "@/core/types/calendar";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";
import Alert from "@/modals/Alert";
import RecurringDeleteAlert from "./RecurringDeleteAlert";
import { I18n } from "@/core/i18n/I18n";

/** Concentrates the event deletion logic (single and recurring) outside EventsList. */
export function useEventDelete() {
  const calendarCtx = useCalendarStore();

  async function deleteSingleEvent(event: CalendarEvent) {
    const confirmed = await Alert.show({
      title: I18n.t("modals.calendar.deleteEventTitle"),
      message: I18n.t("modals.calendar.deleteEventConfirm", { title: event.title }),
      confirmText: I18n.t("control.playlist.delete"),
      isDestructive: true,
    });

    if (confirmed) calendarCtx.actions.deleteEvent(event.id);
  }

  async function deleteRecurringEvent(event: CalendarEvent) {
    const choice = await RecurringDeleteAlert.show({ eventTitle: event.title });
    if (!choice || !event.instanceDate) return;

    if (choice === "instance") {
      calendarCtx.actions.deleteEventInstance(event.id, event.instanceDate);
    } else if (choice === "future") {
      calendarCtx.actions.deleteEventFromDate(event.id, event.instanceDate);
    } else {
      calendarCtx.actions.deleteEvent(event.id);
    }
  }

  async function requestDelete(event: CalendarEvent) {
    if (event.recurrence === "none") {
      await deleteSingleEvent(event);
    } else {
      await deleteRecurringEvent(event);
    }
  }

  return { requestDelete };
}
