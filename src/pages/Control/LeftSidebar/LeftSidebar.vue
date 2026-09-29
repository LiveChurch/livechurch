<script setup lang="ts">
/**
 * Left sidebar (port of `src/pages/Control/LeftSidebar/index.tsx`):
 * editable title of the active playlist + PlaylistList + PlaylistsManager
 * in one resizable panel (width) and another vertical one (heights).
 */
import { ref, watch } from "vue";
import Button from "primevue/button";
import AngleLeftIcon from "@primevue/icons/angleleft";
import AngleRightIcon from "@primevue/icons/angleright";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import ResizablePanel from "@/components/shared/ResizablePanel.vue";
import AddToPlaylistButton from "./AddToPlaylistButton.vue";
import PlaylistList from "./PlaylistList.vue";
import PlaylistSelectionMenu from "./PlaylistSelectionMenu.vue";
import PlaylistTypeFilter from "./PlaylistTypeFilter.vue";
import PlaylistTitle from "./PlaylistTitle.vue";
import PlaylistsManager from "./PlaylistsManager.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlistCtx = usePlaylistStore();

const isCollapsed = ref(false);
const toggle = () => {
  isCollapsed.value = !isCollapsed.value;
};

watch(
  () => playlistCtx.state.activePlaylistId,
  () => {
    const activeElement = document.querySelector(".active-playlist-selection");
    activeElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  },
  { immediate: true, flush: "post" },
);
</script>

<template>
  <!-- Estado recolhido -->
  <aside
    v-if="isCollapsed"
    class="relative flex w-16 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-surface group/sidebar"
  >
    <div class="flex items-center justify-center border-b border-border/60 p-3">
      <Button
        type="button"
        variant="text"
        severity="secondary"
        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/30 hover:text-surface-foreground"
        :title="t('control.playlist.expand')"
        :aria-label="t('control.playlist.expandSidebar')"
        @click="toggle"
      >
        <template #icon><AngleRightIcon /></template>
      </Button>
    </div>
  </aside>

  <!-- Estado expandido -->
  <ResizablePanel
    v-else
    direction="horizontal"
    position="right"
    :min-size="220"
    :max-size="560"
    :default-size="320"
    storage-key="leftSidebarWidth"
    class="flex min-h-0 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-surface group/sidebar"
  >
    <aside class="flex h-full min-w-0 flex-col overflow-hidden">
      <div class="flex flex-col gap-1 border-b border-border/60 p-3">
        <div class="flex items-center justify-between gap-2">
          <PlaylistTitle />
          <Button
            type="button"
            variant="text"
            severity="secondary"
            class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/30 hover:text-surface-foreground"
            :title="t('control.playlist.collapse')"
            :aria-label="t('control.playlist.collapseSidebar')"
            @click="toggle"
          >
            <template #icon><AngleLeftIcon /></template>
          </Button>
        </div>
        <div class="flex items-center justify-end gap-1">
          <PlaylistSelectionMenu />
          <PlaylistTypeFilter />
          <AddToPlaylistButton />
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto bg-background py-2 pl-2 scrollbar-thin">
        <PlaylistList />
      </div>

      <ResizablePanel
        direction="vertical"
        position="top"
        :min-size="150"
        :max-size="600"
        :default-size="200"
        storage-key="leftSidebarPlaylistsHeight"
        class="flex flex-col overflow-hidden border-t border-border/60 bg-background"
      >
        <PlaylistsManager />
      </ResizablePanel>
    </aside>
  </ResizablePanel>
</template>
