import Dexie, { type Table } from "dexie";
import type { MediaAsset } from "@/core/types/media";

/** Media library's own database (separate from the playlists state). */
class MediaDb extends Dexie {
  assets!: Table<MediaAsset, string>;

  constructor() {
    super("livechurch_media");
    this.version(1).stores({ assets: "id, createdAt" });
  }
}

const mediaDb = new MediaDb();

export const MediaPersistence = {
  /** Returns the files from newest to oldest. */
  async loadAll(): Promise<MediaAsset[]> {
    return mediaDb.assets.orderBy("createdAt").reverse().toArray();
  },

  async save(asset: MediaAsset): Promise<void> {
    await mediaDb.assets.put(asset);
  },

  async remove(id: string): Promise<void> {
    await mediaDb.assets.delete(id);
  },
};
