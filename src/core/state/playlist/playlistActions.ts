import type { PlaylistItem, Playlist, Slide } from "@/core/types/playlist";
import { StringUtils } from "@/core/utils/StringUtils";
import { SongUtils } from "@/core/utils/SongUtils";
import type { PlaylistState, ResolveDefaultThemeBinding } from "./playlistTypes";

export function createPlaylistActions(
  state: PlaylistState,
  resolveDefaultThemeBinding: ResolveDefaultThemeBinding,
) {
  return {
    createPlaylist(name?: string) {
      const newPlaylist: Playlist = {
        id: crypto.randomUUID(),
        name: name || `Nova Playlist ${state.playlists.length + 1}`,
        items: [],
      };
      state.playlists.push(newPlaylist);
      state.activePlaylistId = newPlaylist.id;
      state.activeItemId = null;
    },

    updatePlaylistName(id: string, name: string) {
      const playlist = state.playlists.find((p) => p.id === id);
      if (playlist) playlist.name = name;
    },

    removePlaylist(id: string) {
      if (state.playlists.length <= 1) return;

      const playlistIndex = state.playlists.findIndex((p) => p.id === id);
      if (playlistIndex === -1) return;

      const removingActive = state.activePlaylistId === id;
      state.playlists = state.playlists.filter((p) => p.id !== id);
      if (!removingActive) return;

      const fallback =
        state.playlists[Math.max(playlistIndex - 1, 0)] ?? state.playlists[0];
      state.activePlaylistId = fallback?.id ?? "";
      state.activeItemId = fallback?.items[0]?.id ?? null;
    },

    setActivePlaylistId(id: string) {
      state.activePlaylistId = id;
      const target = state.playlists.find((p) => p.id === id);
      state.activeItemId = target?.items[0]?.id ?? null;
    },

    addToPlaylist(incoming: PlaylistItem) {
      const playlist = state.activePlaylist;
      const themeBinding =
        incoming.themeBinding ?? resolveDefaultThemeBinding(incoming.type);
      const item: PlaylistItem = {
        ...incoming,
        id: incoming.id || crypto.randomUUID(),
        slides: incoming.slides ?? [],
        activeSlideIndex: incoming.activeSlideIndex ?? 0,
        themeBinding,
        // The custom theme is independent of the active binding: once
        // created, it stays stored even if the item starts in another mode.
        customTheme:
          incoming.customTheme ??
          (themeBinding?.mode === "custom" ? themeBinding.theme : null),
      };
      const existing = playlist.items.find((i) => i.id === item.id);
      if (existing) {
        state.activeItemId = existing.id;
        return;
      }
      playlist.items.push(item);
      if (playlist.items.length === 1) state.activeItemId = item.id;
    },

    removeFromPlaylist(itemId: string) {
      const playlist =
        state.playlists.find((entry) => entry.items.some((item) => item.id === itemId)) ??
        state.activePlaylist;
      playlist.items = playlist.items.filter((item) => item.id !== itemId);
      if (state.activeItemId === itemId) state.activeItemId = null;
      if (state.background?.itemId === itemId) state.background = null;
      if (state.liveItemId === itemId) {
        state.liveItemId = null;
        state.liveContent = null;
      }
    },

    /** Puts a removed item back at its original position and makes it the active item. */
    restoreItem(playlistId: string, item: PlaylistItem, index: number) {
      const playlist = state.playlists.find((entry) => entry.id === playlistId);
      if (!playlist || playlist.items.some((entry) => entry.id === item.id)) return;
      playlist.items.splice(index, 0, item);
      if (playlist.id === state.activePlaylistId) state.activeItemId = item.id;
    },

    /** Moves the item to the current position of the target item (the displayed list may be filtered). */
    moveItem(itemId: string, targetItemId: string) {
      const items = state.activePlaylist.items;
      const from = items.findIndex((item) => item.id === itemId);
      const to = items.findIndex((item) => item.id === targetItemId);
      if (from < 0 || to < 0 || from === to) return;
      items.splice(to, 0, ...items.splice(from, 1));
    },

    setActiveItemId(id: string | null) {
      state.activeItemId = id;
      const item = state.activeItem;
      if (!item) return;
      item.activeSlideIndex = firstVerseIndex(item);
    },

    setActiveSlideIndex(index: number) {
      const item = state.activeItem;
      if (item) item.activeSlideIndex = index;
    },

    updateSlides(itemId: string, fullText: string) {
      const item = state.playlist.find((i) => i.id === itemId);
      if (!item) return;
      const title = SongUtils.itemSlideTitle(item.type, item.name, item.subtitle);
      item.slides = StringUtils.splitStanzas(fullText).map((text) => ({ text, title }));
      item.activeSlideIndex = 0;
    },

    /** Replaces the name and slides of an item, keeping the active slide when possible. */
    updateItemContent(itemId: string, name: string, slides: Slide[]) {
      const item = state.playlist.find((i) => i.id === itemId);
      if (!item) return;
      item.name = name;
      item.slides = slides;
      item.activeSlideIndex = Math.min(
        item.activeSlideIndex,
        Math.max(slides.length - 1, 0),
      );
    },

    /** Renames the item and the slide titles that followed the old name. */
    renameItem(itemId: string, name: string) {
      const item = state.playlist.find((entry) => entry.id === itemId);
      if (!item) return;
      const previousTitle = SongUtils.itemSlideTitle(item.type, item.name, item.subtitle);
      const nextTitle = SongUtils.itemSlideTitle(item.type, name, item.subtitle);
      item.name = name;
      item.slides.forEach((slide) => {
        if (slide.title === previousTitle) slide.title = nextTitle;
      });
    },

    setItemThemeBinding(
      itemId: string,
      binding: PlaylistItem["themeBinding"],
    ) {
      const item = state.playlist.find((entry) => entry.id === itemId);
      if (!item) return;
      item.themeBinding = binding;
      // The custom theme is never cleared when switching to another binding: it is only
      // updated when the custom binding itself is (re)applied.
      if (binding?.mode === "custom") item.customTheme = binding.theme;
    },

    /** Saves the item's custom theme without changing which binding is active. */
    setItemCustomTheme(itemId: string, theme: PlaylistItem["customTheme"]) {
      const item = state.playlist.find((entry) => entry.id === itemId);
      if (item) item.customTheme = theme;
    },

    toggleThemePanelSection(
      section: NonNullable<PlaylistState["activeThemePanelSection"]>,
    ) {
      state.activeThemePanelSection =
        state.activeThemePanelSection === section ? null : section;
    },
  };
}

function firstVerseIndex(item: PlaylistItem): number {
  if (item.type !== "bible-verse" || !item.bibleData?.verse) return 0;
  const verseIndex = parseInt(item.bibleData.verse) - 1;
  return verseIndex >= 0 ? verseIndex : 0;
}
