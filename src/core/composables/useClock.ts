import { onScopeDispose, onUnmounted, ref } from "vue";

/**
 * Reactive clock that advances every `intervalMs` (default 30s).
 * Replaces React's useClock hook.
 */
export function useClock(intervalMs = 30_000) {
  const now = ref(new Date());

  const id = window.setInterval(() => {
    now.value = new Date();
  }, intervalMs);

  const stop = () => window.clearInterval(id);
  onUnmounted(stop);
  onScopeDispose(stop);

  return { now };
}
