import { onScopeDispose, ref } from "vue";
import { DEFAULT_BROADCAST_STYLE } from "@/core/constants/broadcast";
import { desktop } from "@/core/services/DesktopService";
import type { BroadcastStyle } from "@/core/types/broadcast";

/** Caption style received from the control window, in the broadcast window. */
export function useBroadcastStyle() {
  const style = ref<BroadcastStyle>({ ...DEFAULT_BROADCAST_STYLE });

  desktop
    .getBroadcastStyle()
    .then((initial) => {
      if (initial) style.value = initial;
    })
    .catch((error) => {
      console.error("Falha ao carregar o estilo da transmissão", error);
    });

  const unsubscribe = desktop.onBroadcastStyle((next) => {
    style.value = next;
  });
  onScopeDispose(unsubscribe);

  return { style };
}
