import type { AppLocale } from "../i18n/AppLocale";
import type { BroadcastMode, BroadcastStyle } from "./broadcast";
import type { LyricsSearchResponse } from "./lyrics";
import type { UpdateState } from "./update";
import type { VideoCommand } from "./video";
import type { WatermarkSettings } from "./watermark";

export type { LyricsSearchResponse };

export interface DesktopMonitor {
  id: string;
  name: string;
  isPrimary: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface WindowStatePayload {
  isMaximized: boolean;
}

export type LiveUpdateListener<T> = (payload: T | null) => void;

export interface DesktopApi {
  platform: "electron" | "browser";
  /** Path on disk of a file chosen by the user (Electron only). */
  getPathForFile(file: File): string;
  getCurrentWindowLabel(): Promise<string>;
  closeSplashscreen(): Promise<void>;
  searchLyrics(query: string): Promise<LyricsSearchResponse>;
  getMonitors(): Promise<DesktopMonitor[]>;
  /** Lista as fontes instaladas no sistema operacional. */
  getSystemFonts(): Promise<string[]>;
  ensureProjectorWindow(monitorId?: string | null): Promise<void>;
  identifyMonitor(monitorId: string): Promise<void>;
  sendLiveUpdate<T>(payload: T | null): Promise<void>;
  getLivePayload<T>(): Promise<T | null>;
  onLiveUpdate<T>(listener: LiveUpdateListener<T>): () => void;
  sendVideoCommand(command: VideoCommand): Promise<void>;
  onVideoCommand(listener: (command: VideoCommand) => void): () => void;
  /** Opens one more output window for broadcast, showing only the lyrics or the live output. */
  openBroadcastWindow(mode: BroadcastMode, locale: AppLocale): Promise<void>;
  sendBroadcastStyle(style: BroadcastStyle): Promise<void>;
  /** Last style sent by the control window, or `null` if none was sent yet. */
  getBroadcastStyle(): Promise<BroadcastStyle | null>;
  onBroadcastStyle(listener: (style: BroadcastStyle) => void): () => void;
  sendWatermarkSettings(settings: WatermarkSettings): Promise<void>;
  /** Last configuration sent by the control window, or `null` if none was sent yet. */
  getWatermarkSettings(): Promise<WatermarkSettings | null>;
  onWatermarkSettings(listener: (settings: WatermarkSettings) => void): () => void;
  minimizeWindow(): Promise<void>;
  toggleMaximizeWindow(): Promise<void>;
  closeWindow(): Promise<void>;
  /** Opens an https link in the system's default browser. */
  openExternal(url: string): Promise<void>;
  getWindowState(): Promise<WindowStatePayload>;
  getUpdateState(): Promise<UpdateState>;
  /** Queries the update server; rejects if it is unreachable. */
  checkForUpdate(): Promise<UpdateState>;
  downloadUpdate(): Promise<void>;
  /** Restarts the app (or opens the installer) to finish the already downloaded update. */
  applyUpdate(): Promise<void>;
  onUpdateStateChanged(listener: (state: UpdateState) => void): () => void;
  onWindowStateChanged(
    listener: (payload: WindowStatePayload) => void,
  ): () => void;
  onMonitorsChanged(listener: (monitors: DesktopMonitor[]) => void): () => void;
}
