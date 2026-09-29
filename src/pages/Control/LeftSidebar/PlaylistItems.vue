<script setup lang="ts">
/** Playlist item rows; renaming opens a modal and removing shows an undo toast. */
import { VueDraggable } from "vue-draggable-plus";
import type { SortableEvent } from "sortablejs";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useSavedItemsStore } from "@/core/state/playlist/savedItemsStore";
import { useUndoToastStore } from "@/core/state/undoToast/undoToastStore";
import type { PlaylistItem } from "@/core/types/playlist";
import { openModal } from "@/modals/openModal";
import RenameItemModal from "@/modals/RenameItem/RenameItemModal.vue";
import PlaylistItemRow from "./PlaylistItemRow.vue";

const props = defineProps<{
  items: PlaylistItem[];
}>();

const playlistCtx = usePlaylistStore();
const savedItemsStore = useSavedItemsStore();
const undoToast = useUndoToastStore();

const promptRename = (item: PlaylistItem) => {
  openModal(RenameItemModal, {
    currentName: item.name,
    onRename: (name: string) => playlistCtx.actions.renameItem(item.id, name),
  });
};

const onSort = ({ oldIndex, newIndex }: SortableEvent) => {
  const moved = props.items[oldIndex ?? -1];
  const target = props.items[newIndex ?? -1];
  if (moved && target) playlistCtx.actions.moveItem(moved.id, target.id);
};

const removeWithUndo = (item: PlaylistItem) => {
  const playlistId = playlistCtx.state.activePlaylistId;
  const index = playlistCtx.state.playlist.findIndex((entry) => entry.id === item.id);
  playlistCtx.actions.removeFromPlaylist(item.id);
  undoToast.actions.show(`"${item.name}" removido da playlist`, () =>
    playlistCtx.actions.restoreItem(playlistId, item, index),
  );
};
</script>

<template>
  <VueDraggable
    :model-value="items"
    :animation="150"
    class="space-y-1"
    @update="onSort"
  >
    <PlaylistItemRow
      v-for="item in items"
      :key="item.id"
      :item="item"
      :is-active="playlistCtx.state.activeItemId === item.id"
      @click="playlistCtx.actions.setActiveItemId(item.id)"
      @rename="promptRename(item)"
      @save="savedItemsStore.actions.save(item)"
      @remove="removeWithUndo(item)"
    />
  </VueDraggable>
</template>
