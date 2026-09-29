import { computed, onMounted, onUnmounted, ref } from "vue";
import { useModalStore } from "@/core/state/modal/modalStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { usePresentItem } from "@/core/composables/usePresentItem";
import { PlaylistItemMapper } from "@/core/services/PlaylistItemMapper";
import { useShortcutTarget } from "./useShortcutTarget";

const TYPEABLE_KEY = /^[\p{L}\d]$/u;
const SEPARATOR_KEYS = [" ", ".", ":"];
const DOUBLE_SHIFT_MS = 400;

function isTypingInField(): boolean {
  const active = document.activeElement as HTMLElement | null;
  return (
    active?.tagName === "INPUT" ||
    active?.tagName === "TEXTAREA" ||
    active?.isContentEditable === true
  );
}

/**
 * Quick shortcut (Holyrics style): typing anywhere opens the overlay with
 * the Bible reference or Harpa hymn; Shift twice opens on the previewed chapter; Enter adds to the playlist, Ctrl+Enter also presents live, Esc cancels.
 */
export function useBibleShortcut() {
  const { state, actions } = usePlaylistStore();
  const presentItem = usePresentItem();
  const modalStore = useModalStore();

  const text = ref<string | null>(null);
  const isOpen = computed(() => text.value !== null);
  const { target, hint } = useShortcutTarget(text);

  const close = () => (text.value = null);

  /** Opens already on the previewed book and chapter, leaving only the verse to type. */
  function openOnPreviewChapter() {
    const bible = state.activeItem?.type === "bible-verse" ? state.activeItem.bibleData : null;
    text.value = bible ? `${bible.book} ${bible.chapter} ` : "";
  }

  let lastShiftAt = 0;
  function isDoubleShift(event: KeyboardEvent): boolean {
    if (event.key !== "Shift" || event.repeat) {
      if (event.key !== "Shift") lastShiftAt = 0;
      return false;
    }
    const isDouble = event.timeStamp - lastShiftAt < DOUBLE_SHIFT_MS;
    lastShiftAt = isDouble ? 0 : event.timeStamp;
    return isDouble;
  }

  function openTarget(): string | null {
    const current = target.value;
    if (current?.kind === "bible") {
      return actions.openVerse(current.bookName, current.chapter, current.verse);
    }
    if (current?.kind === "harpa") {
      const item = PlaylistItemMapper.fromHarpa(current.hymn);
      actions.addToPlaylist(item);
      actions.setActiveItemId(item.id);
      return item.id;
    }
    return null;
  }

  function addToPlaylist() {
    openTarget();
    close();
  }

  async function addAndPresent() {
    const id = openTarget();
    close();
    if (id) await presentItem(id);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (isOpen.value && event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      void addAndPresent();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const doubleShift = isDoubleShift(event);
    if (!isOpen.value && doubleShift && !isTypingInField() && modalStore.state.opened.length === 0) {
      openOnPreviewChapter();
      return;
    }

    if (!isOpen.value) {
      const canOpen =
        TYPEABLE_KEY.test(event.key) && !isTypingInField() && modalStore.state.opened.length === 0;
      if (!canOpen) return;
      event.preventDefault();
      text.value = event.key;
      return;
    }

    event.preventDefault();
    if (event.key === "Escape") close();
    else if (event.key === "Enter") addToPlaylist();
    else if (event.key === "Backspace") text.value = (text.value ?? "").slice(0, -1) || null;
    else if (SEPARATOR_KEYS.includes(event.key) || TYPEABLE_KEY.test(event.key)) text.value += event.key;
  }

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));

  return { isOpen, text, target, hint };
}
