<script setup lang="ts">
/**
 * Actions that appear when hovering over a playlist row: actions menu
 * (3 dots) and remove. Clicks do not activate the row.
 */
import { computed, ref } from "vue";
import Button from "primevue/button";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useSavedItemsStore } from "@/core/state/playlist/savedItemsStore";
import type { PlaylistItem } from "@/core/types/playlist";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  item: PlaylistItem;
}>();

const emit = defineEmits<{
  (event: "rename"): void;
  (event: "save"): void;
  (event: "remove"): void;
}>();

const playlistCtx = usePlaylistStore();
const savedItemsStore = useSavedItemsStore();
const menuRef = ref<InstanceType<typeof Menu> | null>(null);

const saveMenuItem = computed<MenuItem>(() =>
  savedItemsStore.actions.isSaved(props.item)
    ? { label: t("control.playlist.itemSaved"), icon: "pi pi-bookmark-fill", disabled: true }
    : {
        label: t("control.playlist.saveItem"),
        icon: "pi pi-bookmark",
        command: () => emit("save"),
      },
);

const isImage = computed(() => props.item.slides[0]?.media?.kind === "image");

const backgroundMenuItem = computed<MenuItem>(() => {
  const isBackground = playlistCtx.actions.isItemBackground(props.item);
  return {
    label: isBackground ? t("control.playlist.removeAsStandby") : t("common.terms.setStandby"),
    icon: isBackground ? "pi pi-times" : "pi pi-image",
    command: () => void playlistCtx.actions.toggleItemBackground(props.item),
  };
});

const menuItems = computed<MenuItem[]>(() => [
  { label: t("control.playlist.rename"), icon: "pi pi-pencil", command: () => emit("rename") },
  saveMenuItem.value,
  ...(isImage.value ? [backgroundMenuItem.value] : []),
]);

const PANEL_CLASS =
  "min-w-44 rounded-xl border border-border bg-surface p-1 shadow-2xl";
const ACTION_CLASS =
  "rounded bg-surface p-1 text-inherit transition-opacity hover:text-surface-foreground";

const toggleMenu = (event: MouseEvent) => menuRef.value?.toggle(event);
</script>

<template>
  <div
    class="absolute right-0 flex items-center opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100"
    @click.stop
    @keydown.enter.stop
  >
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="t('control.playlist.itemActions', { name: item.name })"
      aria-haspopup="true"
      :class="ACTION_CLASS"
      icon="pi pi-ellipsis-v"
      @click="toggleMenu"
    />
    <Menu
      ref="menuRef"
      :model="menuItems"
      popup
      :pt="{ root: PANEL_CLASS, itemLabel: 'font-medium whitespace-nowrap' }"
    />
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="`Remover ${item.name}`"
      :class="[ACTION_CLASS, 'hover:text-danger-hover']"
      icon="pi pi-trash"
      @click="emit('remove')"
    />
  </div>
</template>
