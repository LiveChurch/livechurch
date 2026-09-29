import type { PlaylistState } from "./playlistTypes";

export const PlaylistFocus = {
  /** Activates the item at the given slide, switching playlists if needed. Returns whether the item exists. */
  slide(state: PlaylistState, itemId: string, slideIndex: number): boolean {
    const playlist = state.playlists.find((entry) =>
      entry.items.some((item) => item.id === itemId),
    );
    const item = playlist?.items.find((entry) => entry.id === itemId);
    if (!playlist || !item) return false;

    state.activePlaylistId = playlist.id;
    state.activeItemId = item.id;
    item.activeSlideIndex = slideIndex;
    return true;
  },
};
