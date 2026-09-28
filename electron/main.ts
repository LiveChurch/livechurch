import { app, BrowserWindow, globalShortcut, ipcMain, screen, shell, type Display } from "electron";
import fontList from "font-list";
import type { DesktopMonitor } from "../src/core/types/desktop";
import { LrclibApi, type LrclibSearchResponse } from "../src/core/api/LrclibApi";
import type { VideoCommand } from "../src/core/types/video";
import type { WatermarkSettings } from "../src/core/types/watermark";
import { AppPaths } from "./AppPaths";
import { BroadcastWindowUtils } from "../src/core/utils/BroadcastWindowUtils";
import { BroadcastWindow } from "./broadcast/BroadcastWindow";
import { handleMediaProtocol, registerMediaScheme } from "./mediaProtocol";
import { registerUpdateIpc } from "./update/registerUpdateIpc";

const isDev = !AppPaths.isBundle;
const devServerUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
const appIconPath = AppPaths.icon;

const windowsByLabel = new Map<string, BrowserWindow>();
let splashWindow: BrowserWindow | null = null;
let lastLivePayload: unknown = null;
let lastWatermarkSettings: WatermarkSettings | null = null;
let cachedSystemFonts: Promise<string[]> | null = null;

function getRendererUrl(label: string): string {
  let url: URL;
  try {
    url = new URL(devServerUrl);
  } catch (error) {
    throw new Error(
      `Invalid renderer URL "${devServerUrl}". Check VITE_DEV_SERVER_URL or the Electron dev fallback.`,
      { cause: error },
    );
  }
  url.searchParams.set("windowLabel", label);
  return url.toString();
}

async function waitForDevServer(url: string, timeoutMs = 15000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) return;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Vite dev server did not start in time: ${url}`);
}

async function loadRendererWindow(browserWindow: BrowserWindow, label: string) {
  if (isDev) {
    const rendererUrl = getRendererUrl(label);
    await waitForDevServer(rendererUrl);
    await browserWindow.loadURL(rendererUrl);
    return;
  }

  if (!AppPaths.rendererIndex) throw new Error("Bundle sem renderer/index.html");
  await browserWindow.loadFile(AppPaths.rendererIndex, {
    query: { windowLabel: label },
  });
}

function registerWindow(label: string, browserWindow: BrowserWindow) {
  windowsByLabel.set(label, browserWindow);

  browserWindow.on("closed", () => {
    if (windowsByLabel.get(label) === browserWindow) {
      windowsByLabel.delete(label);
    }
  });

  const emitWindowState = () => {
    browserWindow.webContents.send("desktop:window-state-changed", {
      isMaximized: browserWindow.isMaximized(),
    });
  };

  browserWindow.on("maximize", emitWindowState);
  browserWindow.on("unmaximize", emitWindowState);
  browserWindow.on("enter-full-screen", emitWindowState);
  browserWindow.on("leave-full-screen", emitWindowState);
}

async function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    icon: appIconPath,
    frame: false,
    show: false,
    backgroundColor: "#020617",
    webPreferences: {
      preload: AppPaths.preload,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
    
  });

  const toggleDevTools = () => {
    if (mainWindow.isDestroyed()) return;

    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
      return;
    }

    mainWindow.webContents.openDevTools({ mode: "detach" });
  };

  mainWindow.webContents.on("before-input-event", (_event, input) => {
    const isToggleShortcut =
      input.type === "keyDown" &&
      (input.key === "F12" || ((input.control || input.meta) && input.shift && input.key.toLowerCase() === "i"));

    if (isToggleShortcut) {
      toggleDevTools();
    }
  });

  app.whenReady().then(() => {
    globalShortcut.register("F12", toggleDevTools);
    globalShortcut.register(process.platform === "darwin" ? "Command+Option+I" : "Control+Shift+I", toggleDevTools);
  });

  registerWindow("main", mainWindow);
  let didShowMainWindow = false;

  const showMainWindow = () => {
    if (didShowMainWindow || mainWindow.isDestroyed()) return;
    didShowMainWindow = true;

    mainWindow.show();
    mainWindow.focus();

    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
    }
  };

  mainWindow.once("ready-to-show", () => {
    showMainWindow();
  });

  mainWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => {
      showMainWindow();
    }, 300);
  });

  mainWindow.webContents.once("did-fail-load", (_event, errorCode, errorDescription) => {
    console.error("Failed to load main renderer window:", errorCode, errorDescription);
    showMainWindow();
  });

  await loadRendererWindow(mainWindow, "main");

  return mainWindow;
}

async function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 820,
    height: 500,
    icon: appIconPath,
    frame: false,
    transparent: true,
    show: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    backgroundColor: "#00000000",
  });

  await splashWindow.loadFile(AppPaths.splash);
}

async function ensureProjectorWindow(monitorId?: string | null) {
  console.log(`[Main] Ensuring projector window on monitor: ${monitorId}`);
  const existingWindow = windowsByLabel.get("projector");
  console.log(existingWindow)
  if (existingWindow && !existingWindow.isDestroyed()) {
    return existingWindow;
  }

  const displays = screen.getAllDisplays();
  const fallbackDisplay = displays.find((display) => !display.internal) || displays[0];
  const targetDisplay = displays.find((display) => String(display.id) === String(monitorId)) || fallbackDisplay;

  if (!targetDisplay) {
    console.warn(`[Main] No target display found for ID: ${monitorId}`);
    return;
  }

  const { x, y, width, height } = targetDisplay.bounds;

  console.log(x, y, width, height)
  console.log(targetDisplay, monitorId)

  const projectorWindow = new BrowserWindow({
    x: x,
    y: y,
    width: width,
    height: height,
    icon: appIconPath,
    frame: false,
    show: false,
    backgroundColor: "#000000",
    autoHideMenuBar: true,
    webPreferences: {
      preload: AppPaths.preload,
      contextIsolation: true,
      nodeIntegration: false,
      // The projector window never receives clicks; without this, video with audio would not start.
      autoplayPolicy: "no-user-gesture-required",
    },
  });

  registerWindow("projector", projectorWindow);
  await loadRendererWindow(projectorWindow, "projector");

  projectorWindow.once("ready-to-show", () => {
    projectorWindow.setFullScreen(true);
    projectorWindow.show();
    projectorWindow.focus();

    if (lastLivePayload) {
      projectorWindow.webContents.send("desktop:live-update", lastLivePayload);
    }
  });
  
  projectorWindow.setFullScreen(true);
  projectorWindow.show();
  projectorWindow.focus();

  return projectorWindow;
}

async function createBroadcastWindow(label: string, title: string) {
  const broadcastWindow = BroadcastWindow.create(appIconPath, title);
  registerWindow(label, broadcastWindow);
  await loadRendererWindow(broadcastWindow, label);
  return broadcastWindow;
}

/** Sends `payload` to the projector and to all open broadcast windows. */
function sendToOutputWindows(channel: string, payload: unknown) {
  windowsByLabel.forEach((targetWindow, label) => {
    const isOutput = label === "projector" || BroadcastWindowUtils.parse(label) !== null;
    if (isOutput && !targetWindow.isDestroyed()) {
      targetWindow.webContents.send(channel, payload);
    }
  });
}

function mapDisplay(display: Display): DesktopMonitor {
  const primaryDisplay = screen.getPrimaryDisplay();

  console.log(primaryDisplay)
  return {
    id: String(display.id),
    name: display.label || `Monitor ${display.id}`,
    isPrimary: display.id === primaryDisplay.id,
    position: {
      x: display.bounds.x,
      y: display.bounds.y,
    },
    size: {
      width: display.bounds.width,
      height: display.bounds.height,
    },
  };
}

async function showMonitorOverlay(monitorId: string) {
  const display = screen.getAllDisplays().find((item) => String(item.id) === String(monitorId));
  if (!display) return;

  const label = `monitor-identify-${monitorId}`;
  const existingWindow = windowsByLabel.get(label);
  if (existingWindow && !existingWindow.isDestroyed()) {
    existingWindow.close();
  }

  const overlay = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    icon: appIconPath,
    frame: false,
    transparent: true,
    show: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    fullscreenable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: AppPaths.preload,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  registerWindow(label, overlay);
  await loadRendererWindow(overlay, label);

  setTimeout(() => {
    if (!overlay.isDestroyed()) {
      overlay.close();
    }
  }, 2000);
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

function registerIpcHandlers() {
  const notifyMonitorsChanged = () => {
    const displays = screen.getAllDisplays().map(mapDisplay);
    console.log(`[Main] Displays changed. Current count: ${displays.length}`);
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send("desktop:monitors-changed", displays);
      }
    });
  };

  if (screen) {
    screen.on("display-added", notifyMonitorsChanged);
    screen.on("display-removed", notifyMonitorsChanged);
    screen.on("display-metrics-changed", notifyMonitorsChanged);
  } else {
    console.error("[Main] Screen module not available during IPC registration!");
  }

  ipcMain.handle("desktop:get-window-label", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    const matched = [...windowsByLabel.entries()].find(([, currentWindow]) => currentWindow === window);
    return matched?.[0] || "main";
  });

  ipcMain.handle("desktop:close-splashscreen", () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
    }

    const mainWindow = windowsByLabel.get("main");
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  ipcMain.handle("desktop:search-lyrics", async (_event, query: string) => {
    const url = LrclibApi.searchUrl(query);
    console.log(`[Main] Buscando músicas: ${url}`);
    const raw = await fetchJson<LrclibSearchResponse>(url);
    return LrclibApi.toSearchResponse(raw);
  });

  ipcMain.handle("desktop:get-system-fonts", async () => {
    if (!cachedSystemFonts) {
      cachedSystemFonts = fontList
        .getFonts({ disableQuoting: true })
        .then((fonts) => [...new Set(fonts)].sort((a, b) => a.localeCompare(b)));
    }
    return cachedSystemFonts;
  });

  ipcMain.handle("desktop:get-monitors", () => {
    console.log("monitores", screen.getAllDisplays())
    return screen.getAllDisplays().map(mapDisplay);
  });

  ipcMain.handle("desktop:ensure-projector-window", async (_event, monitorId?: string | null) => {
    await ensureProjectorWindow(monitorId);
  });

  ipcMain.handle("desktop:identify-monitor", async (_event, monitorId: string) => {
    await showMonitorOverlay(monitorId);
  });

  ipcMain.handle("desktop:send-live-update", (_event, payload: unknown) => {
    lastLivePayload = payload;
    sendToOutputWindows("desktop:live-update", payload);
  });

  ipcMain.handle("desktop:send-video-command", (_event, command: VideoCommand) => {
    sendToOutputWindows("desktop:video-command", command);
  });

  ipcMain.handle("desktop:get-live-payload", () => {
    return lastLivePayload;
  });

  ipcMain.handle("desktop:send-watermark-settings", (_event, settings: WatermarkSettings) => {
    lastWatermarkSettings = settings;
    sendToOutputWindows("desktop:watermark-settings", settings);
  });

  ipcMain.handle("desktop:get-watermark-settings", () => {
    return lastWatermarkSettings;
  });

  ipcMain.handle("desktop:minimize-window", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.handle("desktop:toggle-maximize-window", (event) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    if (!currentWindow) return;

    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize();
      return;
    }

    currentWindow.maximize();
  });

  ipcMain.handle("desktop:close-window", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });

  ipcMain.handle("desktop:open-external", async (_event, url: string) => {
    if (new URL(url).protocol !== "https:") {
      throw new Error(`Only https links can be opened externally: ${url}`);
    }

    await shell.openExternal(url);
  });

  registerUpdateIpc();
  BroadcastWindow.registerIpc({
    createWindow: createBroadcastWindow,
    windows: () => windowsByLabel,
  });

  ipcMain.handle("desktop:get-window-state", (event) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    return {
      isMaximized: currentWindow?.isMaximized() || false,
    };
  });
}

registerMediaScheme();

app.whenReady().then(async () => {
  handleMediaProtocol();
  await createSplashWindow();
  await createMainWindow();

  // Register handlers only after the window is ready, which helps detection on Linux
  registerIpcHandlers();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
