import { onMounted, onUnmounted, watch } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";

/**
 * Slides list behaviors (port of `useSlidesListNavigation.ts`):
 * keeps the active slide visible and allows navigating with the arrow keys.
 * Call in the setup of SlidesList.vue.
 */
export function useSlidesListNavigation() {
  const playlistCtx = usePlaylistStore();

  watch(
    () => playlistCtx.state.activeSlideIndex,
    () => {
      const activeElement = document.querySelector(".active-slide-sidebar");
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    { immediate: true, flush: "post" },
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    const active = document.activeElement;
    if (
      active?.tagName === "INPUT" ||
      active?.tagName === "TEXTAREA" ||
      (active as HTMLElement | null)?.contentEditable === "true"
    ) {
      return;
    }

    const { slides, activeSlideIndex } = playlistCtx.state;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      playlistCtx.actions.setActiveSlideIndex(
        Math.min(slides.length - 1, activeSlideIndex + 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      playlistCtx.actions.setActiveSlideIndex(
        Math.max(0, activeSlideIndex - 1),
      );
    }
  };

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
