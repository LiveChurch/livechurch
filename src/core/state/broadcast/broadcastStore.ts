import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";
import { DEFAULT_BROADCAST_STYLE } from "@/core/constants/broadcast";
import { I18n } from "@/core/i18n/I18n";
import { desktop } from "@/core/services/DesktopService";
import { StorageService } from "@/core/services/StorageService";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { BroadcastMode, BroadcastStyle } from "@/core/types/broadcast";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";

const cloneDefaultStyle = (): BroadcastStyle => structuredClone(DEFAULT_BROADCAST_STYLE);

/** Saved style over the default; nested groups also inherit the new fields. */
const readStoredStyle = (): BroadcastStyle => {
  const defaults = cloneDefaultStyle();
  const stored = StorageService.readJson<Partial<BroadcastStyle>>(StorageService.keys.broadcastStyle, {});
  return {
    ...defaults,
    ...stored,
    textBackground: { ...defaults.textBackground, ...stored.textBackground },
    textOutline: { ...defaults.textOutline, ...stored.textOutline },
  };
};

/**
 * Caption style of the broadcast windows. Every change is saved and sent
 * right away to the open windows, so the operator adjusts while watching OBS.
 * Keeps the `{ state, actions }` API of the other stores.
 */
export const useBroadcastStore = defineStore("broadcast", () => {
  const state = reactive<{ style: BroadcastStyle }>({
    style: readStoredStyle(),
  });

  const sendStyle = async () => {
    try {
      await desktop.sendBroadcastStyle({ ...toRaw(state.style) });
    } catch (error) {
      console.error("Falha ao enviar o estilo da transmissão", error);
    }
  };

  const persist = PersistenceUtils.debouncePersist(() =>
    StorageService.writeJson(StorageService.keys.broadcastStyle, state.style),
  );

  watch(
    () => state.style,
    () => {
      void sendStyle();
      persist();
    },
    { deep: true },
  );

  const actions = {
    /** Opens one more broadcast window, showing only the lyrics or the live output. */
    async openWindow(mode: BroadcastMode) {
      await desktop.openBroadcastWindow(mode, I18n.locale);
      await sendStyle();
      await usePlaylistStore().actions.resendLive();
    },

    resetStyle() {
      Object.assign(state.style, cloneDefaultStyle());
    },
  };

  return { state, actions };
});
