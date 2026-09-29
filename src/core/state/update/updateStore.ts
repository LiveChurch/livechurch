import { defineStore } from "pinia";
import { reactive } from "vue";
import { NO_UPDATE_STATE } from "@/core/constants/updateState";
import { desktop } from "@/core/services/DesktopService";
import type { UpdateState } from "@/core/types/update";

/**
 * App update state. The one that queries the server, downloads and checks the file is the
 * Electron main process; here we only mirror its state and trigger the actions.
 */
export const useUpdateStore = defineStore("update", () => {
  const state = reactive<UpdateState>({ ...NO_UPDATE_STATE });

  const sync = (next: UpdateState) => Object.assign(state, next);

  desktop
    .getUpdateState()
    .then(sync)
    .catch((error) => console.error("Falha ao ler o estado da atualização", error));
  desktop.onUpdateStateChanged(sync);

  const actions = {
    /** Queries the server now. Rejects if it is unreachable. */
    async check() {
      sync(await desktop.checkForUpdate());
    },

    async download() {
      await desktop.downloadUpdate();
    },

    /** Restarts the app (or opens the installer) to finish the already downloaded update. */
    async apply() {
      await desktop.applyUpdate();
    },
  };

  return { state, actions };
});
