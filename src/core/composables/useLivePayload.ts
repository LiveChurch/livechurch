import { onScopeDispose, ref } from "vue";
import { desktop } from "@/core/services/DesktopService";
import type { LivePayload } from "@/core/types/live";

/**
 * Live content shown in the projector window (payload via IPC/BroadcastChannel).
 * Replaces React's useLivePayload hook.
 */
export function useLivePayload() {
  const content = ref<LivePayload | null>(null);

  desktop
    .getLivePayload<LivePayload>()
    .then((payload) => {
      if (payload) content.value = payload;
    })
    .catch((error) => {
      console.error("Falha ao carregar conteúdo inicial do projetor", error);
    });

  const unsubscribe = desktop.onLiveUpdate<LivePayload>((payload) => {
    content.value = payload;
  });
  onScopeDispose(() => unsubscribe?.());

  return { content };
}
