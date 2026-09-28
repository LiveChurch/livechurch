import { defineStore } from "pinia";
import { computed, reactive, watch } from "vue";
import type { PlaylistItem } from "@/core/types/playlist";
import { SavedItemUtils } from "@/core/utils/SavedItemUtils";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";
import {
  PlaylistPersistence,
  SAVED_ITEMS_STORAGE_KEY,
} from "./PlaylistPersistence";
import { usePlaylistStore } from "./playlistStore";

/**
 * Playlist items the user saved to reuse in any playlist.
 * Each playlist item linked to a saved one (`savedItemId`) keeps the saved one up to date.
 * Keeps the `{ state, actions }` API of the other stores.
 */
export const useSavedItemsStore = defineStore("savedItems", () => {
  const playlistCtx = usePlaylistStore();
  const state = reactive({
    items: [] as PlaylistItem[],
    isHydrated: false,
  });

  const persist = PersistenceUtils.debouncePersist(() => {
    if (!state.isHydrated) return;
    const snapshot = JSON.parse(JSON.stringify(state.items)) as PlaylistItem[];
    void PlaylistPersistence.write(SAVED_ITEMS_STORAGE_KEY, snapshot).catch(
      (error) => console.error("Falha ao persistir itens salvos", error),
    );
  });

  const savedContentKeys = computed(
    () => new Set(state.items.map(SavedItemUtils.contentKey)),
  );

  const findById = (savedId: string | undefined) =>
    state.items.find((saved) => saved.id === savedId);

  const overwrite = (savedId: string, item: PlaylistItem) => {
    const index = state.items.findIndex((saved) => saved.id === savedId);
    if (index === -1) return;
    state.items[index] = SavedItemUtils.snapshotOf(item, savedId);
    persist();
  };

  const actions = {
    async hydrate() {
      try {
        const saved = await PlaylistPersistence.read<PlaylistItem[]>(
          SAVED_ITEMS_STORAGE_KEY,
        );
        if (Array.isArray(saved)) state.items = saved;
      } catch (error) {
        console.error("Falha ao carregar itens salvos", error);
      } finally {
        state.isHydrated = true;
      }
    },

    /** The item is linked to a saved item that still exists or has the same content as one. */
    isSaved(item: PlaylistItem): boolean {
      return (
        !!findById(item.savedItemId) ||
        savedContentKeys.value.has(SavedItemUtils.contentKey(item))
      );
    },

    /** The saved item is already in the active playlist (linked to it or with the same content). */
    isInActivePlaylist(saved: PlaylistItem): boolean {
      const key = SavedItemUtils.contentKey(saved);
      return playlistCtx.state.playlist.some(
        (item) =>
          item.savedItemId === saved.id ||
          SavedItemUtils.contentKey(item) === key,
      );
    },

    /** Saves the item and links it to the saved one; already saved content is reused, not duplicated. */
    save(item: PlaylistItem) {
      const key = SavedItemUtils.contentKey(item);
      const existing = state.items.find(
        (saved) => SavedItemUtils.contentKey(saved) === key,
      );
      if (existing) {
        item.savedItemId = existing.id;
        return;
      }
      const saved = SavedItemUtils.snapshotOf(item, crypto.randomUUID());
      state.items.unshift(saved);
      item.savedItemId = saved.id;
      persist();
    },

    remove(savedId: string) {
      state.items = state.items.filter((item) => item.id !== savedId);
      persist();
    },
  };

  // Only propagates the items that changed since the last read, so an item
  // sitting in the playlist never overwrites an edit made in another one.
  watch(
    () =>
      playlistCtx.state.playlists
        .flatMap((playlist) => playlist.items)
        .filter((item) => item.savedItemId)
        .map((item) => ({ item, key: SavedItemUtils.contentKey(item) })),
    (linked, previous) => {
      linked.forEach(({ item, key }) => {
        const before = previous?.find((entry) => entry.item.id === item.id);
        if (before && before.key !== key && item.savedItemId) {
          overwrite(item.savedItemId, item);
        }
      });
    },
  );

  void actions.hydrate();

  return { state, actions };
});
