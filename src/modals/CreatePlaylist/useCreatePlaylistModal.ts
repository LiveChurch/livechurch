import { computed, ref, watch } from "vue";
import { DateLocales } from "@/core/i18n/DateLocales";
import { format } from "date-fns";
import type { CalendarEvent } from "@/core/types/calendar";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { CustomItemService } from "@/core/services/CustomItemService";
import { DateUtils } from "@/core/utils/DateUtils";
import { I18n } from "@/core/i18n/I18n";

/** Playlist creation logic: name + optional link to today's event. */
export function useCreatePlaylistModal() {
  const calendarCtx = useCalendarStore();
  const playlistCtx = usePlaylistStore();

  const name = ref("");
  const selectedEventId = ref<string | null>(null);

  const todayEvents = computed<CalendarEvent[]>(() =>
    calendarCtx.actions.getEventsInRange({ start: new Date(), end: new Date() }),
  );

  const eventOptions = computed(() => [
    { label: I18n.t("modals.createPlaylist.none"), value: "" },
    ...todayEvents.value.map((event) => ({ value: event.id, label: event.title })),
  ]);

  const selectedEvent = computed(
    () => todayEvents.value.find((event) => event.id === selectedEventId.value) ?? null,
  );

  /** When an event is chosen, suggests "{event} - {date}" (the user can still edit it). */
  watch(selectedEvent, (event) => {
    if (!event) return;
    const eventDate = event.instanceDate ?? DateUtils.parseDate(event.date);
    name.value = `${event.title} - ${format(eventDate, DateLocales.dateFnsPattern())}`;
  });

  function setSelectedEventId(value: string) {
    selectedEventId.value = value || null;
  }

  /** If the chosen event has a background, inserts it into the newly created playlist and marks it as background. */
  function applyEventBackground() {
    const event = selectedEvent.value;
    if (!event?.background) return;

    const item = CustomItemService.buildImageItem(event.title, event.background);
    playlistCtx.actions.addToPlaylist(item);
    void playlistCtx.actions.toggleBackground();
  }

  return {
    name,
    todayEvents,
    eventOptions,
    selectedEventId,
    setSelectedEventId,
    applyEventBackground,
  };
}
