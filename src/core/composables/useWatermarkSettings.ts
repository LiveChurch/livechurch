import { onScopeDispose, ref } from "vue";
import { DEFAULT_WATERMARK_SETTINGS } from "@/core/constants/watermark";
import { desktop } from "@/core/services/DesktopService";
import type { WatermarkSettings } from "@/core/types/watermark";

/** Watermark configuration received from the control window, in the output windows. */
export function useWatermarkSettings() {
  const settings = ref<WatermarkSettings>({ ...DEFAULT_WATERMARK_SETTINGS });

  desktop
    .getWatermarkSettings()
    .then((initial) => {
      if (initial) settings.value = initial;
    })
    .catch((error) => {
      console.error("Falha ao carregar a marca d'água", error);
    });

  const unsubscribe = desktop.onWatermarkSettings((next) => {
    settings.value = next;
  });
  onScopeDispose(unsubscribe);

  return { settings };
}
