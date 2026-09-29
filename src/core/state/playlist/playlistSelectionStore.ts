import { defineStore } from "pinia";
import { computed, reactive, watch } from "vue";
import { usePlaylistStore } from "./playlistStore";

/**
 * Items of the active playlist marked by the user for batch actions.
 * Kept outside the rows because the sidebar header needs to know what is marked.
 */
export const usePlaylistSelectionStore = defineStore("playlistSelection", () => {
  const playlistCtx = usePlaylistStore();
  const state = reactive({ markedIds: [] as string[] });

  /** Only counts ids that still exist in the active playlist (items can be removed in other ways). */
  const selectedIds = computed(() =>
    state.markedIds.filter((id) =>
      playlistCtx.state.playlist.some((item) => item.id === id),
    ),
  );

  const actions = {
    isSelected(itemId: string) {
      return state.markedIds.includes(itemId);
    },

    toggle(itemId: string) {
      state.markedIds = state.markedIds.includes(itemId)
        ? state.markedIds.filter((id) => id !== itemId)
        : [...state.markedIds, itemId];
    },

    clear() {
      state.markedIds = [];
    },

    removeSelected() {
      selectedIds.value.forEach((id) =>
        playlistCtx.actions.removeFromPlaylist(id),
      );
      actions.clear();
    },
  };

  watch(() => playlistCtx.state.activePlaylistId, actions.clear);

  return { state, selectedIds, actions };
});
