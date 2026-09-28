import { toRaw } from "vue";
import type { PlaylistItem } from "@/core/types/playlist";

/** Converts playlist items to/from the form stored in the saved items list. */
export const SavedItemUtils = {
  /**
   * Item content without identity or transient state (id, active slide, link).
   * Reads the reactive item on purpose (without `toRaw`) so it can be used as a `watch` source.
   */
  contentKey(item: PlaylistItem): string {
    const { id, activeSlideIndex, savedItemId, ...content } = item;
    return JSON.stringify(content);
  },

  /** Independent copy of the item, in the stored format, with the saved item's id. */
  snapshotOf(item: PlaylistItem, savedId: string): PlaylistItem {
    const copy = structuredClone(toRaw(item));
    delete copy.savedItemId;
    return { ...copy, id: savedId, activeSlideIndex: 0 };
  },

  /** New playlist item linked to the saved item, so the same item can be added more than once. */
  instantiate(saved: PlaylistItem): PlaylistItem {
    return {
      ...structuredClone(toRaw(saved)),
      id: crypto.randomUUID(),
      savedItemId: saved.id,
    };
  },
};
