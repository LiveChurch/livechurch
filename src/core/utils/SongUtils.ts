import type { PlaylistItem } from "@/core/types/playlist";

export const SongUtils = {
  /** Title shown on the song's slides: "Title - Author" (only the title if there is no author). */
  slideTitle(title: string, author?: string): string {
    const trimmedAuthor = author?.trim();
    return trimmedAuthor ? `${title} - ${trimmedAuthor}` : title;
  },

  /** Title of an item's slides: songs carry the author; other items only the name. */
  itemSlideTitle(type: PlaylistItem["type"], name: string, subtitle?: string): string {
    return type === "song" ? SongUtils.slideTitle(name, subtitle) : name;
  },
};
