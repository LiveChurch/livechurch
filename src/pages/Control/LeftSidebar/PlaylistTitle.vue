<script setup lang="ts">
/** Editable name of the active playlist (contenteditable, saves on blur). */
import { ref, watch } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlistCtx = usePlaylistStore();

const titleRef = ref<HTMLElement | null>(null);
const isTitleFocused = ref(false);

// Keeps the contentEditable text in sync with the store when the
// user is not editing (equivalent to React's re-render).
watch(
  () => [
    playlistCtx.state.activePlaylist?.id,
    playlistCtx.state.activePlaylist?.name,
  ],
  () => {
    if (titleRef.value && !isTitleFocused.value) {
      titleRef.value.textContent =
        playlistCtx.state.activePlaylist?.name ?? t("common.terms.playlist");
    }
  },
);

const onTitleBlur = (event: FocusEvent) => {
  isTitleFocused.value = false;
  const element = event.target as HTMLElement;
  const newName = element.innerText.trim();
  const activePlaylist = playlistCtx.state.activePlaylist;
  if (newName && activePlaylist) {
    playlistCtx.actions.updatePlaylistName(activePlaylist.id, newName);
  } else if (activePlaylist) {
    element.innerText = activePlaylist.name;
  }
};

const onTitleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    (event.currentTarget as HTMLElement).blur();
  }
};
</script>

<template>
  <span
    ref="titleRef"
    contenteditable="true"
    role="textbox"
    :aria-label="t('control.playlist.activeName')"
    class="cursor-text text-xs font-black text-muted-foreground outline-none transition-colors hover:text-surface-foreground focus:text-brand"
    @focus="isTitleFocused = true"
    @blur="onTitleBlur"
    @keydown="onTitleKeyDown"
  >{{ playlistCtx.state.activePlaylist?.name || t("common.terms.playlist") }}</span>
</template>
