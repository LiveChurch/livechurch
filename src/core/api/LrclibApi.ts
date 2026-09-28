import type { LyricsSearchResponse, LyricsTrack } from "../types/lyrics";
import { StringUtils } from "../utils/StringUtils";

const SEARCH_URL = "https://lrclib.net/api/search";
const MAX_RESULTS = 10;

interface LrclibTrack {
  id: number;
  trackName: string;
  artistName: string;
  plainLyrics: string | null;
}

export type LrclibSearchResponse = LrclibTrack[];

/** Key that groups versions of the same song ("Yahweh" and "Yahweh (Live)"). */
function songKey(track: LrclibTrack): string {
  return StringUtils.normalize(`${track.artistName}|${StringUtils.removeBrackets(track.trackName)}`);
}

function toTrack(track: LrclibTrack): LyricsTrack {
  return {
    trackId: track.id,
    trackName: track.trackName,
    artistName: track.artistName,
    lyrics: track.plainLyrics ?? "",
  };
}

export const LrclibApi = {
  searchUrl(query: string): string {
    const url = new URL(SEARCH_URL);
    url.searchParams.set("q", query);
    return url.toString();
  },

  /** Only songs with lyrics are included, without repeating the same song in different versions. */
  toSearchResponse(raw: LrclibSearchResponse): LyricsSearchResponse {
    const seen = new Set<string>();
    const tracks = raw.filter((track) => {
      if (!track.plainLyrics?.trim()) return false;

      const key = songKey(track);
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });

    return { data: tracks.slice(0, MAX_RESULTS).map(toTrack) };
  },
};
