import type { LiveNotice, NoticeHistoryEntry } from "@/core/types/live";

export const NoticeUtils = {
  /** The notice of a history entry, without the id. */
  fromEntry(entry: NoticeHistoryEntry): LiveNotice {
    const { id, ...notice } = entry;
    return notice;
  },
};
