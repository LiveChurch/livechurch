import { LrclibApi, type LrclibSearchResponse } from "../api/LrclibApi";
import { NO_UPDATE_STATE } from "../constants/updateState";
import type { BroadcastMode, BroadcastStyle } from "../types/broadcast";
import { BroadcastWindowUtils } from "../utils/BroadcastWindowUtils";
import { LatestValueChannel } from "./LatestValueChannel";
import type {
  DesktopApi,
  DesktopMonitor,
  LiveUpdateListener,
  LyricsSearchResponse,
  WindowStatePayload,
} from "../types/desktop";
import type { UpdateState } from "../types/update";
import type { VideoCommand } from "../types/video";
import type { WatermarkSettings } from "../types/watermark";

declare global {
  interface Window {
    desktop?: Omit<DesktopApi, "platform"> & { platform: "electron" };
  }
}

const liveChannel = new LatestValueChannel<unknown>("livechurch-live");

/** Broadcast windows opened by this tab, by label, to number the new ones. */
const broadcastWindows = new Map<string, Window>();

const broadcastStyleChannel = new LatestValueChannel<BroadcastStyle>("livechurch-broadcast");

const watermarkChannel = new LatestValueChannel<WatermarkSettings>("livechurch-watermark");

const videoChannel =
  typeof window !== "undefined" ? new BroadcastChannel("livechurch-video") : null;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

/** Opens this same page in another tab/window, which chooses the screen by `windowLabel`. */
function openLabeledWindow(label: string): Window | null {
  const url = new URL(window.location.href);
  url.searchParams.set("windowLabel", label);
  return window.open(url.toString(), label);
}

const BrowserDesktopApi: DesktopApi = {
  platform: "browser",
  getPathForFile() {
    throw new Error("Caminho de arquivo indisponível fora do Electron");
  },
  async getCurrentWindowLabel() {
    return new URLSearchParams(window.location.search).get("windowLabel") || "main";
  },
  async closeSplashscreen() {},
  async searchLyrics(query: string): Promise<LyricsSearchResponse> {
    const raw = await fetchJson<LrclibSearchResponse>(LrclibApi.searchUrl(query));
    return LrclibApi.toSearchResponse(raw);
  },
  async getMonitors(): Promise<DesktopMonitor[]> {
    return [];
  },
  async getSystemFonts(): Promise<string[]> {
    const queryLocalFonts = (window as { queryLocalFonts?: () => Promise<{ family: string }[]> })
      .queryLocalFonts;
    if (!queryLocalFonts) return [];
    try {
      const fonts = await queryLocalFonts();
      return [...new Set(fonts.map((font) => font.family))].sort((a, b) =>
        a.localeCompare(b),
      );
    } catch {
      return [];
    }
  },
  async ensureProjectorWindow() {
    openLabeledWindow("projector");
  },
  async identifyMonitor() {},
  async sendLiveUpdate(payload) {
    liveChannel.post(payload);
  },
  async getLivePayload<T>() {
    return (await liveChannel.requestLatest()) as T | null;
  },
  onLiveUpdate<T>(listener: LiveUpdateListener<T>) {
    return liveChannel.subscribe((payload) => listener(payload as T | null));
  },
  async sendVideoCommand(command: VideoCommand) {
    videoChannel?.postMessage(command);
  },
  onVideoCommand(listener) {
    if (!videoChannel) return () => {};
    const handler = (event: MessageEvent<VideoCommand>) => listener(event.data);
    videoChannel.addEventListener("message", handler);
    return () => videoChannel.removeEventListener("message", handler);
  },
  async openBroadcastWindow(mode: BroadcastMode) {
    const openLabels = [...broadcastWindows].filter(([, opened]) => !opened.closed).map(([label]) => label);
    const label = BroadcastWindowUtils.label(BroadcastWindowUtils.next(mode, openLabels));
    const opened = openLabeledWindow(label);
    if (opened) broadcastWindows.set(label, opened);
  },
  async sendBroadcastStyle(style: BroadcastStyle) {
    broadcastStyleChannel.post(style);
  },
  async getBroadcastStyle() {
    return broadcastStyleChannel.requestLatest();
  },
  onBroadcastStyle(listener) {
    return broadcastStyleChannel.subscribe(listener);
  },
  async sendWatermarkSettings(settings: WatermarkSettings) {
    watermarkChannel.post(settings);
  },
  async getWatermarkSettings() {
    return watermarkChannel.requestLatest();
  },
  onWatermarkSettings(listener) {
    return watermarkChannel.subscribe(listener);
  },
  async minimizeWindow() {},
  async toggleMaximizeWindow() {},
  async closeWindow() {},
  async openExternal(url: string) {
    window.open(url, "_blank", "noopener");
  },
  async getWindowState(): Promise<WindowStatePayload> {
    return { isMaximized: false };
  },
  async getUpdateState(): Promise<UpdateState> {
    return NO_UPDATE_STATE;
  },
  async checkForUpdate(): Promise<UpdateState> {
    return NO_UPDATE_STATE;
  },
  async downloadUpdate() {},
  async applyUpdate() {},
  onUpdateStateChanged() {
    return () => {};
  },
  onWindowStateChanged() {
    return () => {};
  },
  onMonitorsChanged() {
    return () => {};
  },
};

export const desktop: DesktopApi = window.desktop
  ? { ...window.desktop, platform: "electron" }
  : BrowserDesktopApi;
