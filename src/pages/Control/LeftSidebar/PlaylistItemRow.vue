<script setup lang="ts">
/**
 * Row of a playlist item (port of
 * `src/pages/Control/LeftSidebar/PlaylistItemRow.tsx`).
 * emits: click (activate item), rename, save (store the item), remove.
 */
import { computed } from "vue";
import type { PlaylistItem } from "@/core/types/playlist";
import { cn } from "@/core/utils/ClassNameUtils";
import PlaylistItemActions from "./PlaylistItemActions.vue";
import PlaylistItemLeading from "./PlaylistItemLeading.vue";

const props = defineProps<{
  item: PlaylistItem;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (event: "click"): void;
  (event: "rename"): void;
  (event: "save"): void;
  (event: "remove"): void;
}>();

const rowClass = computed(() =>
  cn(
    "group relative flex cursor-pointer items-center gap-3 rounded border-l-2 px-3 py-2 pr-16 text-sm transition-all duration-150",
    props.isActive
      ? "border-brand bg-gradient-to-r from-brand/10 to-transparent text-brand"
      : "border-transparent text-muted-foreground hover:bg-surface-light/30 hover:text-surface-foreground",
    props.isActive && "active-playlist-item",
  ),
);

const onRowKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") emit("click");
};
</script>

<template>
  <div
    role="button"
    :tabindex="0"
    :class="rowClass"
    @click="emit('click')"
    @keydown="onRowKeyDown"
  >
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <PlaylistItemLeading :item="item" :is-active="isActive" />
      <div class="min-w-0 flex-1">
        <span class="block break-words font-medium">{{ item.name }}</span>
        <span class="block break-words text-xs opacity-60">
          {{ item.subtitle }}
        </span>
      </div>
    </div>
    <PlaylistItemActions
      :item="item"
      @rename="emit('rename')"
      @save="emit('save')"
      @remove="emit('remove')"
    />
  </div>
</template>
