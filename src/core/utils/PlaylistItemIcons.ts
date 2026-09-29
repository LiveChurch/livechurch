import type { PlaylistItemType } from "@/core/types/playlist";

export const PlaylistItemIcons = {
  /** `app~` name of the icon that represents the item's type. */
  forType(type: PlaylistItemType): string {
    switch (type) {
      case "song":
      case "harpa":
        return "app~music";
      case "template-instance":
      case "free-slides":
        return "app~fileText";
      case "media":
        return "app~image";
      case "countdown":
        return "app~timer";
      default:
        return "app~book";
    }
  },
};
