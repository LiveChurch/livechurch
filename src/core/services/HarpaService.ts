import { markRaw } from "vue";
import harpaData from "../data/harpa.json";
import { StringUtils } from "../utils/StringUtils";

export interface HarpaHymn {
  number: string;
  title: string;
  chorus: string;
  verses: Record<string, string>;
  slides: string[];
}

interface RawHarpaEntry {
  hino?: string;
  coro?: string;
  verses?: Record<string, string>;
}

type RawHarpaIndex = Record<string, RawHarpaEntry>;

interface SearchableHymn {
  number: string;
  entry: RawHarpaEntry;
  haystack: string;
}

const METADATA_KEY = "-1";

// Static data: must never become reactive state.
const harpaIndex = markRaw(harpaData as unknown as RawHarpaIndex);

let searchIndex: SearchableHymn[] | null = null;

/** Title + lyrics already normalized, computed only once (and not on every search keystroke). */
function getSearchIndex(): SearchableHymn[] {
  searchIndex ??= Object.entries(harpaIndex)
    .filter(([key, entry]) => key !== METADATA_KEY && !!entry)
    .map(([number, entry]) => ({
      number,
      entry,
      haystack: StringUtils.normalize(
        `${entry.hino ?? ""} ${Object.values(entry.verses ?? {}).join(" ")}`,
      ),
    }));
  return searchIndex;
}

function toLines(text: string): string[] {
  return StringUtils.toLines(text.replace(/<br>\s*/gi, "\n"));
}

function buildSlides(entry: RawHarpaEntry): string[] {
  const chorusLines = toLines(entry.coro ?? "");
  const versesObj = entry.verses ?? {};
  const verseKeys = Object.keys(versesObj).sort((a, b) => Number(a) - Number(b));

  const slides: string[] = [];
  verseKeys.forEach((key) => {
    StringUtils.chunkLines(toLines(versesObj[key] ?? "")).forEach((block) =>
      slides.push(block),
    );
    StringUtils.chunkLines(chorusLines).forEach((block) => slides.push(block));
  });

  if (!slides.length && chorusLines.length) {
    StringUtils.chunkLines(chorusLines).forEach((block) => slides.push(block));
  }

  return slides.length > 0 ? slides : ["(sem texto)"];
}

function toHymn(number: string, entry: RawHarpaEntry): HarpaHymn {
  return {
    number,
    title: entry.hino || `Harpa ${number}`,
    chorus: entry.coro ?? "",
    verses: { ...entry.verses },
    slides: buildSlides(entry),
  };
}

export const HarpaService = {
  /** Looks up a hymn by its exact Harpa Cristã number. */
  findById(number: string): HarpaHymn | null {
    const raw = harpaIndex[number];
    return raw ? toHymn(number, raw) : null;
  },

  /** Looks up hymns whose title or lyrics contain the given text. */
  findByText(query: string, limit = 5): HarpaHymn[] {
    const normalized = StringUtils.normalize(query);

    return getSearchIndex()
      .filter((hymn) => hymn.haystack.includes(normalized))
      .slice(0, limit)
      .map((hymn) => toHymn(hymn.number, hymn.entry));
  },
};
