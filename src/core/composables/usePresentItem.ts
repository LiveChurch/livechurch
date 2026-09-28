import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useThemeStore } from "@/core/state/theme/themeStore";

/** Returns a function that activates the item and puts its slide live. */
export function usePresentItem() {
  const { state, actions } = usePlaylistStore();
  const themeStore = useThemeStore();

  return async (itemId: string) => {
    actions.setActiveItemId(itemId);
    const slide = state.slides[state.activeSlideIndex];
    if (!slide) return;
    actions.setLiveItemId(itemId);
    await actions.goLive(
      slide,
      themeStore.actions.resolveThemeBinding(state.activeItem?.themeBinding),
    );
  };
}
