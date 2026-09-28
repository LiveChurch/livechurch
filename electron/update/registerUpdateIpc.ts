import { ipcMain } from "electron";
import { UpdateConfig } from "./UpdateConfig";
import { UpdateService } from "./UpdateService";

function checkInBackground() {
  UpdateService.check().catch((error: Error) =>
    console.warn("[Update] Não foi possível verificar atualizações:", error.message),
  );
}

export function registerUpdateIpc() {
  ipcMain.handle("desktop:update-get-state", () => UpdateService.getState());
  ipcMain.handle("desktop:update-check", () => UpdateService.check());
  ipcMain.handle("desktop:update-download", () => UpdateService.download());
  ipcMain.handle("desktop:update-apply", () => UpdateService.apply());

  setTimeout(checkInBackground, UpdateConfig.firstCheckDelayMs);
  setInterval(checkInBackground, UpdateConfig.checkIntervalMs);
}
