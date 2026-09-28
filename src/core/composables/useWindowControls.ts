import { onScopeDispose, ref } from "vue";
import { desktop } from "@/core/services/DesktopService";
import type { WindowStatePayload } from "@/core/types/desktop";

/**
 * Frameless window controls (minimize/maximize/close) via Electron IPC.
 * Replaces React's useWindowControls hook.
 */
export function useWindowControls() {
  const isMaximized = ref(false);

  let unsubscribe: (() => void) | undefined;

  void (async () => {
    const windowState: WindowStatePayload = await desktop.getWindowState();
    isMaximized.value = windowState.isMaximized;
    unsubscribe = desktop.onWindowStateChanged((payload) => {
      isMaximized.value = payload.isMaximized;
    });
  })();

  const minimize = () => void desktop.minimizeWindow();
  const toggleMaximize = () => void desktop.toggleMaximizeWindow();
  const close = () => void desktop.closeWindow();

  onScopeDispose(() => unsubscribe?.());

  return { isMaximized, minimize, toggleMaximize, close };
}
