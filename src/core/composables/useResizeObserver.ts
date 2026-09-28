import { onScopeDispose, watch } from "vue";
import type { Ref } from "vue";

function hasResizeObserver() {
  return typeof window.ResizeObserver !== "undefined";
}

interface UseResizeObserverOptions<T> {
  ref: Ref<T | null | undefined> | undefined;
  box?: ResizeObserverBoxOptions;
  onResize: () => void;
}

/**
 * Observes an element's size and calls a callback when it changes.
 * Replaces React's useResizeObserver hook.
 */
export function useResizeObserver<T extends Element>(
  options: UseResizeObserverOptions<T>,
) {
  const { ref, box, onResize } = options;
  if (!ref) return;

  let resizeObserverInstance: ResizeObserver | null = null;
  let listeningToWindow = false;

  const handleWindowResize = () => onResize();

  const cleanup = () => {
    if (resizeObserverInstance) {
      resizeObserverInstance.disconnect();
      resizeObserverInstance = null;
    }
    if (listeningToWindow) {
      window.removeEventListener("resize", handleWindowResize, false);
      listeningToWindow = false;
    }
  };

  watch(
    ref,
    (element) => {
      cleanup();
      if (!element) return;

      if (!hasResizeObserver()) {
        window.addEventListener("resize", handleWindowResize, false);
        listeningToWindow = true;
        return;
      }

      resizeObserverInstance = new window.ResizeObserver((entries) => {
        if (!entries.length) return;
        onResize();
      });
      resizeObserverInstance.observe(element, { box });
    },
    { immediate: true },
  );

  onScopeDispose(cleanup);
}
