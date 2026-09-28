<script setup lang="ts">
/**
 * Playlists manager (port of
 * `src/pages/Control/LeftSidebar/PlaylistsManager.tsx`).
 */
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import { cn } from "@/core/utils/ClassNameUtils";
import Alert from "@/modals/Alert";
import CreatePlaylistModal from "@/modals/CreatePlaylist/CreatePlaylistModal.vue";
import { openModal } from "@/modals/openModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlistCtx = usePlaylistStore();
const state = playlistCtx.state;
const actions = playlistCtx.actions;

const promptCreate = () => {
  openModal(CreatePlaylistModal, {
    onCreate: (name: string) => actions.createPlaylist(name),
  });
};

const confirmRemove = async (playlistId: string, name: string) => {
  const confirmed = await Alert.show({
    title: t("control.playlist.removePlaylistTitle"),
    message: t("control.playlist.removePlaylistConfirm", { name }),
    confirmText: t("common.actions.remove"),
    isDestructive: true,
  });
  if (confirmed) actions.removePlaylist(playlistId);
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="flex flex-shrink-0 items-center justify-between border-b border-border/60 bg-surface-light/30 px-4 py-3"
    >
      <h3
        class="text-xs font-black uppercase text-muted-foreground"
      >
        {{ t('control.playlist.playlists') }}
      </h3>
      <Button
        type="button"
        variant="text"
        severity="secondary"
        class="rounded p-1 text-brand transition-colors hover:bg-surface-light/30"
        icon="pi pi-plus"
        :title="t('control.playlist.newPlaylist')"
        :aria-label="t('control.playlist.newPlaylistLabel')"
        @click="promptCreate"
      />
    </div>

    <div class="min-h-0 flex-1 space-y-0.5 overflow-y-auto py-2 pl-2 scrollbar-thin">
      <div
        v-for="playlist in state.playlists"
        :key="playlist.id"
        role="button"
        :tabindex="0"
        :class="
          cn(
            'group flex cursor-pointer items-center gap-3 rounded py-2 pl-3 text-xs transition-all',
            state.activePlaylistId === playlist.id
              ? 'active-playlist-selection bg-brand/10 font-bold text-brand shadow-[inset_2px_0_0_0_currentColor]'
              : 'text-muted-foreground hover:bg-surface-light/30 hover:text-surface-foreground',
          )
        "
        @click="actions.setActivePlaylistId(playlist.id)"
        @keydown="
          (event: KeyboardEvent) =>
            event.key === 'Enter' && actions.setActivePlaylistId(playlist.id)
        "
      >
        <AppIcon name="app~layoutList" size="12px" />
        <span class="flex-1 truncate">{{ playlist.name }}</span>
        <span class="font-mono text-xs opacity-40">{{ playlist.items.length }}</span>
        <Button
          v-if="state.playlists.length > 1"
          type="button"
          variant="text"
          severity="secondary"
          :aria-label="`Remover playlist ${playlist.name}`"
          class="rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:text-danger-hover"
          :title="t('control.playlist.removePlaylist')"
          icon="pi pi-trash"
          @click="
            (event: MouseEvent) => {
              event.stopPropagation();
              void confirmRemove(playlist.id, playlist.name);
            }
          "
        />
      </div>
    </div>
  </div>
</template>
