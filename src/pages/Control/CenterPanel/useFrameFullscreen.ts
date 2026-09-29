import { onUnmounted, ref, watch } from "vue";

/** Fullscreen state of a frame; Esc exits while it is open. */
export function useFrameFullscreen() {
  const fullscreen = ref(false);

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") fullscreen.value = false;
  }

  watch(fullscreen, (open) => {
    if (open) document.addEventListener("keydown", onKeydown);
    else document.removeEventListener("keydown", onKeydown);
  });
  onUnmounted(() => document.removeEventListener("keydown", onKeydown));

  return {
    fullscreen,
    enter: () => (fullscreen.value = true),
    exit: () => (fullscreen.value = false),
  };
}
