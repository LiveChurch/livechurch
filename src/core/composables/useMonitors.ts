import { onScopeDispose, ref } from "vue";
import { desktop } from "@/core/services/DesktopService";
import type { DesktopMonitor } from "@/core/types/desktop";
import { I18n } from "@/core/i18n/I18n";

/**
 * List of the system's monitors, updated in real time via IPC.
 * Replaces React's useMonitors hook.
 */
export function useMonitors() {
  const monitors = ref<DesktopMonitor[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      monitors.value = await desktop.getMonitors();
    } catch (err) {
      console.error("Falha ao carregar monitores", err);
      error.value = I18n.t("core.errors.listMonitors");
      monitors.value = [];
    } finally {
      loading.value = false;
    }
  };

  const unsubscribe = desktop.onMonitorsChanged((list) => {
    monitors.value = list;
  });
  onScopeDispose(() => unsubscribe?.());

  return { monitors, loading, error, load };
}
