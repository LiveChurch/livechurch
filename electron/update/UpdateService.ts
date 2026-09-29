import { BrowserWindow } from "electron";
import type { UpdateState } from "../../src/core/types/update";
import { AppPaths } from "../AppPaths";
import { UpdateApi } from "./UpdateApi";
import { UpdateConfig } from "./UpdateConfig";
import { UpdateInstaller, type ApplyUpdate } from "./UpdateInstaller";
import { UpdateIntegrity } from "./UpdateIntegrity";
import type { UpdateRelease } from "./UpdateTypes";
import { UPDATE_PUBLIC_KEY } from "./publicKey";
import { VersionUtils } from "./VersionUtils";

const IDLE_STATE: UpdateState = {
  status: "idle",
  version: null,
  type: null,
  notes: null,
  progress: 0,
  error: null,
};

let state: UpdateState = IDLE_STATE;
let release: UpdateRelease | null = null;
let applyUpdate: ApplyUpdate | null = null;

function setState(changes: Partial<UpdateState>) {
  state = { ...state, ...changes };
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) window.webContents.send("desktop:update-state-changed", state);
  });
}

/** Reason why the release cannot be installed by this copy of the app, or null if it can. */
function rejectionReason(candidate: UpdateRelease): string | null {
  if (candidate.platform !== UpdateConfig.platform) return "plataforma diferente";
  if (!UpdateIntegrity.isSignatureValid(candidate, UPDATE_PUBLIC_KEY)) return "assinatura inválida";
  if (candidate.type === "code" && candidate.electronVersion !== process.versions.electron) {
    return `o bundle exige Electron ${candidate.electronVersion}; é preciso instalar a versão completa`;
  }
  return null;
}

export const UpdateService = {
  getState: (): UpdateState => state,

  /** Queries the platform manifest. Only acts on bundles; in development there is nothing to update. */
  async check(): Promise<UpdateState> {
    if (!AppPaths.isBundle || state.status === "downloading" || state.status === "ready") {
      return state;
    }

    const latest = await UpdateApi.fetchLatest();
    if (!latest || !VersionUtils.isNewer(latest.version, UpdateConfig.currentVersion)) {
      release = null;
      setState(IDLE_STATE);
      return state;
    }

    const reason = rejectionReason(latest);
    if (reason) {
      console.warn(`[Update] Versão ${latest.version} ignorada: ${reason}`);
      setState(IDLE_STATE);
      return state;
    }

    release = latest;
    setState({
      ...IDLE_STATE,
      status: "available",
      version: latest.version,
      type: latest.type,
      notes: latest.notes,
    });
    return state;
  },

  async download() {
    if (!release || (state.status !== "available" && state.status !== "error")) return;

    setState({ status: "downloading", progress: 0, error: null });
    try {
      applyUpdate = await UpdateInstaller.prepare(release, (progress) => setState({ progress }));
      setState({ status: "ready", progress: 1 });
    } catch (error) {
      console.error("[Update] Falha ao baixar a atualização:", error);
      setState({ status: "error", error: error instanceof Error ? error.message : String(error) });
    }
  },

  async apply() {
    if (state.status !== "ready" || !applyUpdate) return;
    await applyUpdate();
  },
};
