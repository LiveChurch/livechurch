import type { PlaylistItem } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import type { createLiveActions } from "./liveActions";
import type { PlaylistState } from "./playlistTypes";

type LiveActions = ReturnType<typeof createLiveActions>;

/** The standby screen ("background") is the media slide shown on air when nothing else is playing. */
export function createBackgroundActions(
  state: PlaylistState,
  live: LiveActions,
  resolveTheme: (item: PlaylistItem) => SlidesTheme,
) {
  /** Puts the standby screen on air, without touching the preview. Returns whether there was a standby screen. */
  async function showBackground(): Promise<boolean> {
    const background = state.background;
    if (!background) return false;

    const item = state.playlists
      .flatMap((playlist) => playlist.items)
      .find((entry) => entry.id === background.itemId);
    if (!item?.slides[background.slideIndex]) return false;

    await live.goLiveSlide(item, background.slideIndex, resolveTheme(item));
    return true;
  }

  function isBackground(itemId: string, slideIndex: number) {
    const { background } = state;
    return background?.itemId === itemId && background.slideIndex === slideIndex;
  }

  /** Marks the slide as background, or undoes it if it already is the background. */
  async function toggleSlideBackground(itemId: string, slideIndex: number) {
    if (isBackground(itemId, slideIndex)) {
      state.background = null;
      return;
    }

    const nothingPlaying = !state.liveContent || state.isLiveBackground;
    state.background = { itemId, slideIndex };
    if (nothingPlaying) await showBackground();
  }

  return {
    showBackground,

    /** Marks the previewed slide as background, or undoes it if it already is the background. */
    async toggleBackground() {
      const item = state.activeItem;
      if (item) await toggleSlideBackground(item.id, state.activeSlideIndex);
    },

    /** Marks the playlist item's image as background, or undoes it if it already is the background. */
    async toggleItemBackground(item: PlaylistItem) {
      await toggleSlideBackground(item.id, 0);
    },

    /** The item is the image set as the standby screen. */
    isItemBackground(item: PlaylistItem) {
      return isBackground(item.id, 0);
    },

    /** Takes what is playing off air: goes back to the standby screen or, without one, clears the output. */
    async stopLive() {
      if (!(await showBackground())) await live.clearLive();
    },
  };
}
