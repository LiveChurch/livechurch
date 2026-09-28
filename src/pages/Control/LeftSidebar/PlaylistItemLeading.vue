<script setup lang="ts">
/**
 * Icon of the item's type in the playlist row. When hovering over the row (or if the
 * item is already checked) it becomes a checkbox for batch selection.
 */
import { computed } from "vue";
import Checkbox from "primevue/checkbox";
import AppIcon from "@/components/ui/AppIcon.vue";
import { usePlaylistSelectionStore } from "@/core/state/playlist/playlistSelectionStore";
import type { PlaylistItem } from "@/core/types/playlist";
import { cn } from "@/core/utils/ClassNameUtils";
import { PlaylistItemIcons } from "@/core/utils/PlaylistItemIcons";

const props = defineProps<{
  item: PlaylistItem;
  isActive: boolean;
}>();

const selection = usePlaylistSelectionStore();
const isSelected = computed(() => selection.actions.isSelected(props.item.id));

const iconName = computed(() => PlaylistItemIcons.forType(props.item.type));

const boxClass = computed(() =>
  cn(
    "flex shrink-0 items-center justify-center rounded p-1.5",
    props.isActive ? "bg-brand/20" : "bg-surface-light/30",
  ),
);

const iconClass = computed(() =>
  isSelected.value ? "hidden" : "flex group-hover:hidden",
);
const checkboxClass = computed(() =>
  isSelected.value ? "flex" : "hidden group-hover:flex",
);
</script>

<template>
  <div :class="boxClass">
    <div :class="iconClass">
      <AppIcon :name="iconName" size="16px" />
    </div>
    <div :class="checkboxClass" @click.stop @keydown.enter.stop>
      <Checkbox
        binary
        size="small"
        :model-value="isSelected"
        :aria-label="`Selecionar ${item.name}`"
        @update:model-value="selection.actions.toggle(item.id)"
      />
    </div>
  </div>
</template>
