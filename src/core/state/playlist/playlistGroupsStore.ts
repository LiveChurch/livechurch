import { defineStore } from "pinia";
import { reactive } from "vue";

/**
 * Type filter of the active playlist's item list; `null` shows all
 * items. Kept outside the component to survive the list being unmounted (e.g.
 * sidebar collapsed and expanded again).
 */
export const usePlaylistGroupsStore = defineStore("playlistGroups", () => {
  const state = reactive({
    activeGroupId: null as string | null,
  });

  const actions = {
    setActiveGroup(groupId: string | null) {
      state.activeGroupId = groupId;
    },
  };

  return { state, actions };
});
