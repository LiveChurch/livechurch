import Dexie, { type Table } from "dexie";
import type {
  PersistedPlaylistState,
  PlaylistItem,
  SlideTemplate,
} from "@/core/types/playlist";

interface PersistenceEntry {
  key: string;
  value: PersistedPlaylistState | SlideTemplate[] | PlaylistItem[];
}

export const PLAYLIST_STORAGE_KEY = "playlistState";
export const TEMPLATE_STORAGE_KEY = "slideTemplates";
export const SAVED_ITEMS_STORAGE_KEY = "savedPlaylistItems";

class HolyPresenterDb extends Dexie {
  appState!: Table<PersistenceEntry, string>;

  constructor() {
    super("livechurch_dexie");
    this.version(1).stores({
      app_state: "key",
    });
    this.appState = this.table("app_state");
  }
}

const persistenceDb = new HolyPresenterDb();

export const PlaylistPersistence = {
  async read<T>(key: string): Promise<T | null> {
    const entry = await persistenceDb.appState.get(key);
    return (entry?.value as T | undefined) ?? null;
  },

  async write<T>(key: string, value: T): Promise<void> {
    await persistenceDb.appState.put({ key, value: value as never });
  },
};
