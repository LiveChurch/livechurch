import { contextBridge, ipcRenderer, webUtils } from "electron";
import type { DesktopApi } from "../src/core/types/desktop";

/** Listens to `channel` and returns the function that cancels the subscription. */
function subscribe<T>(channel: string) {
  return (listener: (payload: T) => void) => {
    const wrappedListener = (_event: unknown, payload: T) => listener(payload);
    ipcRenderer.on(channel, wrappedListener);
    return () => {
      ipcRenderer.removeListener(channel, wrappedListener);
    };
  };
}

const desktop: Omit<DesktopApi, "platform"> & { platform: "electron" } = {
  platform: "electron",
  getPathForFile: (file) => webUtils.getPathForFile(file),
  getCurrentWindowLabel: () => ipcRenderer.invoke("desktop:get-window-label"),
  closeSplashscreen: () => ipcRenderer.invoke("desktop:close-splashscreen"),
  searchLyrics: (query) => ipcRenderer.invoke("desktop:search-lyrics", query),
  getMonitors: () => ipcRenderer.invoke("desktop:get-monitors"),
  getSystemFonts: () => ipcRenderer.invoke("desktop:get-system-fonts"),
  ensureProjectorWindow: (monitorId) =>
    ipcRenderer.invoke("desktop:ensure-projector-window", monitorId),
  identifyMonitor: (monitorId) => ipcRenderer.invoke("desktop:identify-monitor", monitorId),
  sendLiveUpdate: (payload) => ipcRenderer.invoke("desktop:send-live-update", payload),
  getLivePayload: () => ipcRenderer.invoke("desktop:get-live-payload"),
  sendVideoCommand: (command) => ipcRenderer.invoke("desktop:send-video-command", command),
  onVideoCommand: subscribe("desktop:video-command"),
  openBroadcastWindow: (mode, locale) =>
    ipcRenderer.invoke("desktop:open-broadcast-window", mode, locale),
  sendBroadcastStyle: (style) => ipcRenderer.invoke("desktop:send-broadcast-style", style),
  getBroadcastStyle: () => ipcRenderer.invoke("desktop:get-broadcast-style"),
  onBroadcastStyle: subscribe("desktop:broadcast-style"),
  sendWatermarkSettings: (settings) =>
    ipcRenderer.invoke("desktop:send-watermark-settings", settings),
  getWatermarkSettings: () => ipcRenderer.invoke("desktop:get-watermark-settings"),
  onWatermarkSettings: subscribe("desktop:watermark-settings"),
  minimizeWindow: () => ipcRenderer.invoke("desktop:minimize-window"),
  toggleMaximizeWindow: () => ipcRenderer.invoke("desktop:toggle-maximize-window"),
  closeWindow: () => ipcRenderer.invoke("desktop:close-window"),
  openExternal: (url) => ipcRenderer.invoke("desktop:open-external", url),
  getWindowState: () => ipcRenderer.invoke("desktop:get-window-state"),
  getUpdateState: () => ipcRenderer.invoke("desktop:update-get-state"),
  checkForUpdate: () => ipcRenderer.invoke("desktop:update-check"),
  downloadUpdate: () => ipcRenderer.invoke("desktop:update-download"),
  applyUpdate: () => ipcRenderer.invoke("desktop:update-apply"),
  onUpdateStateChanged: subscribe("desktop:update-state-changed"),
  onLiveUpdate: subscribe("desktop:live-update"),
  onWindowStateChanged: subscribe("desktop:window-state-changed"),
  onMonitorsChanged: subscribe("desktop:monitors-changed"),
};

contextBridge.exposeInMainWorld("desktop", desktop);
