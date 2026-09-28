import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";
import { DEFAULT_WATERMARK_SETTINGS } from "@/core/constants/watermark";
import { desktop } from "@/core/services/DesktopService";
import { StorageService } from "@/core/services/StorageService";
import type { WatermarkSettings } from "@/core/types/watermark";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";

const cloneDefaultSettings = (): WatermarkSettings =>
  structuredClone(DEFAULT_WATERMARK_SETTINGS);

/** Configuration saved over the default, so new fields are inherited. */
const readStoredSettings = (): WatermarkSettings => ({
  ...cloneDefaultSettings(),
  ...StorageService.readJson<Partial<WatermarkSettings>>(
    StorageService.keys.watermarkSettings,
    {},
  ),
});

/**
 * Fixed watermark over the slide (Control, Projector and Broadcast). Each
 * change is saved and sent right away to the output windows, following the same pattern as
 * `broadcastStore`. Keeps the `{ state, actions }` API of the other stores.
 */
export const useWatermarkStore = defineStore("watermark", () => {
  const state = reactive<{ settings: WatermarkSettings }>({
    settings: readStoredSettings(),
  });

  const sendSettings = async () => {
    try {
      await desktop.sendWatermarkSettings({ ...toRaw(state.settings) });
    } catch (error) {
      console.error("Falha ao enviar a marca d'água", error);
    }
  };

  const persist = PersistenceUtils.debouncePersist(() =>
    StorageService.writeJson(StorageService.keys.watermarkSettings, state.settings),
  );

  watch(
    () => state.settings,
    () => {
      void sendSettings();
      persist();
    },
    { deep: true },
  );

  const actions = {
    setLogo(imageUrl: string) {
      state.settings.imageUrl = imageUrl;
    },

    removeLogo() {
      state.settings.imageUrl = "";
    },

    resetSettings() {
      Object.assign(state.settings, cloneDefaultSettings());
    },
  };

  return { state, actions };
});
