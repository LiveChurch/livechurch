import { onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/core/state/modal/modalStore";

function isTypingInField(): boolean {
  const active = document.activeElement as HTMLElement | null;
  return (
    active?.tagName === "INPUT" ||
    active?.tagName === "TEXTAREA" ||
    active?.isContentEditable === true
  );
}

/** Ctrl+A presents the preview slide live (does not act in text fields or with a modal open). */
export function useGoLiveShortcut(onGoLive: () => void) {
  const modalStore = useModalStore();

  function handleKeyDown(event: KeyboardEvent) {
    const isShortcut = event.ctrlKey && !event.altKey && event.key.toLowerCase() === "a";
    if (!isShortcut || isTypingInField() || modalStore.state.opened.length > 0) return;
    event.preventDefault();
    onGoLive();
  }

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
