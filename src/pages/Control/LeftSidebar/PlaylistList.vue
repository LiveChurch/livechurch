<script setup lang="ts">
/**
 * Items of the active playlist (port of `src/pages/Control/LeftSidebar/PlaylistList.tsx`).
 * Filtered by type via PlaylistTypeFilter or all together. Keeps the active item visible.
 */
import { onMounted, ref, watch } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import PlaylistItems from "./PlaylistItems.vue";
import { usePlaylistGroups } from "./usePlaylistGroups";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const state = usePlaylistStore().state;
const { filteredItems } = usePlaylistGroups();
const listRef = ref<HTMLElement | null>(null);

const scrollToActive = () => {
  const activeElement = listRef.value?.querySelector(".active-playlist-item");
  activeElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

onMounted(scrollToActive);
watch(() => state.activeItemId, scrollToActive, { flush: "post" });
</script>

<template>
  <div ref="listRef" class="mt-2 space-y-1">
    <PlaylistItems :items="filteredItems" />

    <div
      v-if="state.playlist.length === 0"
      class="py-8 text-center text-xs uppercase leading-relaxed tracking-widest text-muted-foreground"
    >
      {{ t('control.playlist.empty') }}
      <br />
      <span class="text-xs opacity-40">{{ t('control.playlist.emptyHint') }}</span>
    </div>
  </div>
</template>
