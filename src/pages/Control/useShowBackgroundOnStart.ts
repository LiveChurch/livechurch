import { watch } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";

/**
 * When opening the app with nothing on air, shows the background. Lives in the control window
 * because the store is also created in the projector window, which must not act on its own.
 */
export function useShowBackgroundOnStart() {
  const { state, actions } = usePlaylistStore();

  watch(
    () => state.isHydrated,
    (isHydrated) => {
      if (isHydrated && !state.liveContent) void actions.showBackground();
    },
    { immediate: true },
  );
}
