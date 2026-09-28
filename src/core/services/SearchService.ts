import type { LyricsTrack } from "../types/lyrics";
import type { SearchResult } from "../types/search";
import { BibleBooks } from "../utils/BibleBooks";
import { StringUtils } from "../utils/StringUtils";
import { I18n } from "../i18n/I18n";
import { useLanguageStore } from "../state/language/languageStore";
import { HarpaService } from "./HarpaService";

const AGENDA_KEYWORDS = [
  "agenda", "eventos", "calendario", "gerar",
  "events", "calendar", "generate", "generar",
];

const AGENDA_ACTION_KEYS: Record<string, string> = {
  week: "control.search.generateWeek",
  "next-week": "control.search.generateNextWeek",
  month: "control.search.generateMonth",
};

const NUMBER_ONLY_PATTERN = /^\d{1,4}$/;

interface ParsedVerse {
  book: string;
  chapter: string;
  verse?: string;
}

function parseVerseReference(query: string): ParsedVerse | null {
  const normalizedQuery = StringUtils.normalize(query);

  for (const book of BibleBooks.names()) {
    const normalizedBook = StringUtils.normalize(book);
    if (!normalizedQuery.startsWith(normalizedBook)) continue;

    const remainder = normalizedQuery.slice(normalizedBook.length).trim();
    const match = remainder.match(/^(\d+)(?:[.:\s](\d+))?$/);
    if (match) return { book, chapter: match[1], verse: match[2] };
    return null;
  }

  return null;
}

function searchBooks(query: string, limit = 3): string[] {
  const normalized = StringUtils.normalize(query);
  return BibleBooks.names()
    .filter((book) => StringUtils.normalize(book).includes(normalized))
    .slice(0, limit);
}

function buildAgendaActions(query: string): SearchResult[] {
  const lower = query.toLowerCase();
  if (!AGENDA_KEYWORDS.some((keyword) => lower.includes(keyword))) return [];

  return Object.keys(AGENDA_ACTION_KEYS).map((range) => ({
    id: `action-calendar-${range}`,
    type: "action-calendar" as const,
    title: I18n.t(AGENDA_ACTION_KEYS[range]),
    subtitle: I18n.t("control.search.quickAction"),
    data: { range },
  }));
}

function buildBibleResults(query: string): SearchResult[] {
  const reference = parseVerseReference(query);

  if (reference) {
    const { book, chapter, verse } = reference;
    return [
      {
        id: `bible-${book}-${chapter}-${verse ?? "all"}`,
        type: "bible-verse",
        title: `${book} ${chapter}${verse ? `:${verse}` : ""}`,
        subtitle: verse ? I18n.t("control.search.goToVerse") : I18n.t("control.search.goToChapter"),
        data: { book, chapter, verse },
      },
    ];
  }

  return searchBooks(query).map((book) => ({
    id: `book-${book}`,
    type: "bible" as const,
    title: book,
    subtitle: I18n.t("control.search.bibleBook"),
    data: { book },
  }));
}

function buildHarpaResults(query: string): SearchResult[] {
  if (!useLanguageStore().state.supportsHarpa) return [];
  const trimmed = query.trim();
  let hymns: ReturnType<typeof HarpaService.findByText>;

  if (NUMBER_ONLY_PATTERN.test(trimmed)) {
    const hymn = HarpaService.findById(trimmed);
    hymns = hymn ? [hymn] : [];
  } else {
    hymns = HarpaService.findByText(trimmed);
  }

  return hymns.map((hymn) => ({
    id: `harpa-${hymn.number}`,
    type: "harpa" as const,
    title: hymn.title,
    subtitle: I18n.t("common.terms.harpa"),
    data: {
      number: hymn.number,
      chorus: hymn.chorus,
      verses: hymn.verses,
      slides: hymn.slides,
    },
  }));
}

function toSongResult(track: LyricsTrack): SearchResult {
  return {
    id: `lrclib-${track.trackId}`,
    type: "song",
    title: track.trackName,
    subtitle: track.artistName,
    data: {
      id: String(track.trackId),
      title: track.trackName,
      artist: track.artistName,
      lyrics: track.lyrics,
    },
  };
}

export const SearchService = {
  /** Local results (calendar, bible, harpa) + already mapped remote songs. */
  buildLocalResults(query: string, remoteTracks: LyricsTrack[]): SearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) return [];

    return [
      ...buildAgendaActions(trimmed),
      ...buildBibleResults(trimmed),
      ...buildHarpaResults(trimmed),
      ...remoteTracks.map(toSongResult),
    ];
  },
};

export type { ParsedVerse };
