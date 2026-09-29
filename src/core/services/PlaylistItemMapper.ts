import { v4 as uuidv4 } from "uuid";
import type { PlaylistItem } from "@/core/types/playlist";
import type { SearchResult } from "@/core/types/search";
import type { HarpaHymn } from "./HarpaService";
import type { CalendarEvent, DateRange } from "@/core/types/calendar";
import { DateUtils } from "@/core/utils/DateUtils";
import { StringUtils } from "@/core/utils/StringUtils";
import { I18n } from "@/core/i18n/I18n";
import { LyricsService } from "./LyricsService";

function buildSearchItemId(result: SearchResult): string {
  const { type, title, subtitle, data } = result;

  if (type === "harpa") {
    return `harpa-${StringUtils.slugify(String(data?.number || title))}`;
  }
  if (type === "bible" || type === "bible-verse") {
    const book = StringUtils.slugify(data?.book || "");
    const chapter = StringUtils.slugify(String(data?.chapter || ""));
    const verse = type === "bible-verse" && data?.verse ? `-${data.verse}` : "";
    return `biblia-${book}-${chapter}${verse}`;
  }
  if (type === "song") {
    return `song-${StringUtils.slugify(title)}-${StringUtils.slugify(subtitle || "")}`;
  }
  return result.id || crypto.randomUUID();
}

function mapTemplateInstance(result: SearchResult, id: string): PlaylistItem {
  const content = result.data?.content || "";
  const slides = StringUtils.splitStanzas(content).map((text) => ({
    text,
    title: result.title,
  }));
  return {
    id,
    name: result.title,
    type: "template-instance",
    slides,
    activeSlideIndex: 0,
  };
}

function buildHarpaItem(id: string, title: string, texts: string[]): PlaylistItem {
  return {
    id,
    name: title,
    subtitle: I18n.t("common.terms.harpa"),
    type: "harpa",
    slides: texts.map((text) => ({ text, title })),
    activeSlideIndex: 0,
  };
}

function mapHarpa(result: SearchResult, id: string): PlaylistItem {
  return buildHarpaItem(id, result.title, result.data?.slides || []);
}

function mapBible(result: SearchResult, id: string): PlaylistItem {
  return {
    id,
    name: result.title,
    subtitle: I18n.t("common.terms.bible"),
    type: result.type === "bible" ? "bible" : "bible-verse",
    slides: [],
    activeSlideIndex: 0,
    bibleData: {
      book: result.data?.book,
      chapter: result.data?.chapter,
      verse: result.data?.verse,
    },
  };
}

function mapSong(result: SearchResult, id: string): PlaylistItem {
  return {
    id,
    name: result.title,
    subtitle: result.subtitle,
    type: "song",
    slides: LyricsService.toSlides(result.data?.lyrics ?? "", result.title, result.subtitle),
    activeSlideIndex: 0,
  };
}

function eventToSlide(event: CalendarEvent) {
  const date = new Date(event.instanceDate || event.date);
  return {
    title: I18n.t("core.agenda.weeklyAgenda"),
    text: `${event.title}\n\n${DateUtils.formatWeekdayDate(date)}\n${event.description || ""}`,
  };
}

function mapCalendarAction(events: CalendarEvent[]): PlaylistItem {
  const slides = events.length
    ? events.map(eventToSlide)
    : [
        {
          title: I18n.t("core.agenda.weeklyAgenda"),
          text: I18n.t("core.agenda.noEvents"),
        },
      ];

  return {
    id: uuidv4(),
    name: I18n.t("core.agenda.weeklyAgenda"),
    type: "template-instance",
    slides,
    activeSlideIndex: 0,
  };
}

function buildAgendaRange(rangeKind?: string): DateRange {
  const start = new Date();
  const end = new Date();

  if (rangeKind === "week" || !rangeKind) end.setDate(start.getDate() + 7);
  if (rangeKind === "next-week") {
    start.setDate(start.getDate() + 7);
    end.setDate(start.getDate() + 7);
  }
  if (rangeKind === "month") end.setDate(start.getDate() + 30);

  return { start, end };
}

export const PlaylistItemMapper = {
  fromHarpa(hymn: HarpaHymn): PlaylistItem {
    return buildHarpaItem(`harpa-${StringUtils.slugify(hymn.number)}`, hymn.title, hymn.slides);
  },

  async fromSearchResult(
    result: SearchResult,
    upcomingEvents: (range: DateRange) => CalendarEvent[],
  ): Promise<PlaylistItem> {
    if (result.type === "action-calendar") {
      return mapCalendarAction(upcomingEvents(buildAgendaRange(result.data?.range)));
    }

    const id = buildSearchItemId(result);

    if (result.type === "template-instance") {
      return mapTemplateInstance(result, id);
    }
    if (result.type === "harpa") return mapHarpa(result, id);
    if (result.type === "bible" || result.type === "bible-verse") {
      return mapBible(result, id);
    }
    if (result.type === "song") return mapSong(result, id);

    return {
      id,
      name: result.title,
      subtitle: result.subtitle,
      type: result.type,
      slides: [],
      activeSlideIndex: 0,
    };
  },
};
