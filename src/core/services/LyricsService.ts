import { desktop } from "./DesktopService";
import { SongUtils } from "@/core/utils/SongUtils";
import { StringUtils } from "@/core/utils/StringUtils";
import type { LyricsTrack } from "@/core/types/lyrics";
import type { Slide } from "@/core/types/playlist";

const MIN_QUERY_LENGTH = 3;

export const LyricsService = {
  /** Searches songs with lyrics on LRCLIB (via desktop API). */
  async searchTracks(query: string): Promise<LyricsTrack[]> {
    if (!query || query.trim().length < MIN_QUERY_LENGTH) return [];

    const response = await desktop.searchLyrics(query);
    return response.data ?? [];
  },

  /** Ready-made slides of the lyrics: one stanza per slide, split into blocks of lines. */
  toSlides(lyrics: string, title: string, artist: string): Slide[] {
    const slideTitle = SongUtils.slideTitle(title, artist);
    const slides = StringUtils.splitStanzas(lyrics).flatMap((stanza) =>
      StringUtils.chunkLines(StringUtils.toLines(stanza)).map((text) => ({
        text,
        title: slideTitle,
      })),
    );
    return slides.length > 0 ? slides : [{ text: title, title: slideTitle }];
  },
};
