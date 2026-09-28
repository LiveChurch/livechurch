import { v4 as uuidv4 } from "uuid";
import { I18n } from "@/core/i18n/I18n";
import type { CalendarEvent, DateRange } from "@/core/types/calendar";
import type { PlaylistItem } from "@/core/types/playlist";

function eventToSlide(event: CalendarEvent, agendaTitle: string) {
  const eventDate = event.instanceDate || new Date(event.date);
  const dateStr = eventDate.toLocaleDateString(I18n.locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return {
    title: agendaTitle,
    text: `${dateStr.toUpperCase()}\n${event.time}\n\n${event.title}${
      event.description ? `\n${event.description}` : ""
    }`,
  };
}

export const AgendaSlidesService = {
  buildPlaylistItem(events: CalendarEvent[], range: DateRange): PlaylistItem {
    const agendaTitle = I18n.t("core.agenda.title", {
      start: range.start.toLocaleDateString(I18n.locale),
      end: range.end.toLocaleDateString(I18n.locale),
    });

    const sorted = [...events].sort(
      (a, b) =>
        (a.instanceDate || new Date(a.date)).getTime() -
        (b.instanceDate || new Date(b.date)).getTime(),
    );

    return {
      id: `agenda-${uuidv4()}`,
      name: agendaTitle,
      type: "template-instance",
      slides: sorted.map((event) => eventToSlide(event, agendaTitle)),
      activeSlideIndex: 0,
    };
  },
};
