import { BrowserWindow, ipcMain } from "electron";
import type { AppLocale } from "../../src/core/i18n/AppLocale";
import type { BroadcastMode, BroadcastStyle } from "../../src/core/types/broadcast";
import { BroadcastWindowUtils } from "../../src/core/utils/BroadcastWindowUtils";
import { AppPaths } from "../AppPaths";

const STYLE_CHANNEL = "desktop:broadcast-style";

/** Last style sent by the control window, delivered to the windows when they open. */
let lastStyle: BroadcastStyle | null = null;

interface BroadcastWindowHost {
  /** Creates, registers and loads a window with this label. */
  createWindow(label: string, title: string): Promise<BrowserWindow>;
  /** Open windows, by label. */
  windows(): Map<string, BrowserWindow>;
}

/**
 * Output windows for streaming, captured in OBS with "Window Capture".
 * Each click opens one more, showing only the lyrics (over chroma key) or the live
 * output; the numbered title (the page does not change it) tells them apart in OBS.
 * They have a native frame so they can be moved and resized; `useContentSize`
 * makes the captured area 1280×720.
 */
export const BroadcastWindow = {
  create(icon: string, title: string) {
    const broadcastWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 640,
      minHeight: 360,
      useContentSize: true,
      title,
      icon,
      show: false,
      autoHideMenuBar: true,
      backgroundColor: "#00ff00",
      webPreferences: {
        preload: AppPaths.preload,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    broadcastWindow.on("page-title-updated", (event) => event.preventDefault());
    return broadcastWindow;
  },

  registerIpc(host: BroadcastWindowHost) {
    ipcMain.handle("desktop:open-broadcast-window", async (_event, mode: BroadcastMode, locale: AppLocale) => {
      const info = BroadcastWindowUtils.next(mode, host.windows().keys());
      const broadcastWindow = await host.createWindow(
        BroadcastWindowUtils.label(info),
        BroadcastWindowUtils.title(info, locale),
      );
      broadcastWindow.show();
      broadcastWindow.focus();
    });

    ipcMain.handle("desktop:send-broadcast-style", (_event, style: BroadcastStyle) => {
      lastStyle = style;
      host.windows().forEach((broadcastWindow, label) => {
        if (BroadcastWindowUtils.parse(label) && !broadcastWindow.isDestroyed()) {
          broadcastWindow.webContents.send(STYLE_CHANNEL, style);
        }
      });
    });

    ipcMain.handle("desktop:get-broadcast-style", () => lastStyle);
  },
};
