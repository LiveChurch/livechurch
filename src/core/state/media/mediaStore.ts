import { defineStore } from "pinia";
import { reactive } from "vue";
import type { MediaAsset } from "@/core/types/media";
import { MediaPersistence } from "./MediaPersistence";

/**
 * Media library uploaded by the user (images stored in the library and
 * videos referenced by their path on disk).
 * Keeps the `{ state, actions }` API of the other stores.
 */
export const useMediaStore = defineStore("media", () => {
  const state = reactive({
    assets: [] as MediaAsset[],
    isHydrated: false,
  });

  const add = async (asset: MediaAsset): Promise<MediaAsset> => {
    state.assets.unshift(asset);
    try {
      await MediaPersistence.save(asset);
    } catch (error) {
      console.error("Falha ao salvar a mídia na biblioteca", error);
    }
    return asset;
  };

  const actions = {
    async hydrate() {
      try {
        state.assets = await MediaPersistence.loadAll();
      } catch (error) {
        console.error("Falha ao carregar a biblioteca de mídia", error);
      } finally {
        state.isHydrated = true;
      }
    },

    addImage(name: string, dataUrl: string): Promise<MediaAsset> {
      return add({
        id: crypto.randomUUID(),
        name,
        kind: "image",
        dataUrl,
        createdAt: Date.now(),
      });
    },

    /** The same file is not added twice to the library. */
    async addVideo(name: string, filePath: string): Promise<MediaAsset> {
      const existing = state.assets.find(
        (asset) => asset.kind === "video" && asset.filePath === filePath,
      );
      if (existing) return existing;

      return add({
        id: crypto.randomUUID(),
        name,
        kind: "video",
        filePath,
        createdAt: Date.now(),
      });
    },

    async removeAsset(id: string): Promise<void> {
      state.assets = state.assets.filter((asset) => asset.id !== id);
      try {
        await MediaPersistence.remove(id);
      } catch (error) {
        console.error("Falha ao remover a mídia da biblioteca", error);
      }
    },
  };

  void actions.hydrate();

  return { state, actions };
});
