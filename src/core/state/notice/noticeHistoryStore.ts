import { defineStore } from "pinia";
import { reactive } from "vue";
import type { LiveNotice, NoticeHistoryEntry } from "@/core/types/live";

const MAX_ENTRIES = 15;

/**
 * Notices already shown in this session, from most recent to oldest, to reapply
 * without typing again. Kept only in memory (not persisted).
 * Keeps the `{ state, actions }` API of the other stores.
 */
export const useNoticeHistoryStore = defineStore("noticeHistory", () => {
  const state = reactive({
    items: [] as NoticeHistoryEntry[],
  });

  const actions = {
    /** Puts the notice at the top; the same text replaces the previous entry (with the new style). */
    add(notice: LiveNotice) {
      const others = state.items.filter((entry) => entry.text !== notice.text);
      const entry = { id: crypto.randomUUID(), ...notice };
      state.items = [entry, ...others].slice(0, MAX_ENTRIES);
    },

    remove(id: string) {
      state.items = state.items.filter((entry) => entry.id !== id);
    },
  };

  return { state, actions };
});
