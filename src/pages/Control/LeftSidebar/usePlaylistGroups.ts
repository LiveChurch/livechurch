import { computed, watch } from "vue";
import { useLanguageStore } from "@/core/state/language/languageStore";
import { usePlaylistGroupsStore } from "@/core/state/playlist/playlistGroupsStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { PlaylistGroupUtils } from "@/core/utils/PlaylistGroupUtils";

/**
 * Groups (types) available in the active playlist and the items filtered by the
 * group chosen in the menu. The filter is cleared when the active item becomes
 * of another type (e.g. item added via search), so it stays visible.
 */
export function usePlaylistGroups() {
  const state = usePlaylistStore().state;
  const groupsStore = usePlaylistGroupsStore();

  const languageState = useLanguageStore().state;

  const groups = computed(() =>
    PlaylistGroupUtils.group(state.playlist).filter(
      (group) => group.id !== "harpa" || languageState.supportsHarpa,
    ),
  );

  const filteredItems = computed(() => {
    const activeGroupId = groupsStore.state.activeGroupId;
    if (!activeGroupId) return state.playlist;
    return (
      groups.value.find((group) => group.id === activeGroupId)?.items ??
      state.playlist
    );
  });

  watch(
    () => state.activeItemId,
    (itemId) => {
      const activeGroupId = groupsStore.state.activeGroupId;
      if (!activeGroupId) return;
      const item = state.playlist.find((entry) => entry.id === itemId);
      const groupId = item && PlaylistGroupUtils.groupIdOf(item);
      if (groupId && groupId !== activeGroupId) {
        groupsStore.actions.setActiveGroup(null);
      }
    },
  );

  return { groups, filteredItems };
}
