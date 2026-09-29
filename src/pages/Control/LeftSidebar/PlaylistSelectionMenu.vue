<script setup lang="ts">
/**
 * Actions menu for the items checked in the playlist. Only appears when there is a selection.
 * For now the only action is delete (with confirmation).
 */
import { computed, ref } from "vue";
import Button from "primevue/button";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import { usePlaylistSelectionStore } from "@/core/state/playlist/playlistSelectionStore";
import Alert from "@/modals/Alert";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const selection = usePlaylistSelectionStore();
const menuRef = ref<InstanceType<typeof Menu> | null>(null);

const count = computed(() => selection.selectedIds.length);
const confirmRemove = async () => {
  const confirmed = await Alert.show({
    title: t("control.playlist.removeItemsTitle"),
    message:
      count.value === 1
        ? t("control.playlist.removeOneConfirm")
        : t("control.playlist.removeManyConfirm", { count: count.value }),
    confirmText: t("common.actions.remove"),
    isDestructive: true,
  });
  if (confirmed) selection.actions.removeSelected();
};

const items = computed<MenuItem[]>(() => [
  { label: t("control.playlist.delete"), icon: "pi pi-trash", command: () => void confirmRemove() },
]);

const PANEL_CLASS =
  "min-w-44 rounded-xl border border-border bg-surface p-1 shadow-2xl";

const toggle = (event: Event) => menuRef.value?.toggle(event);
</script>

<template>
  <div v-if="count > 0" class="flex items-center">
    <Button
      type="button"
      variant="text"
      severity="secondary"
      class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/30 hover:text-surface-foreground"
      icon="pi pi-ellipsis-v"
      :badge="String(count)"
      badge-severity="secondary"
      :title="t('control.playlist.selectedActions')"
      :aria-label="t('control.playlist.selectedActions')"
      aria-haspopup="true"
      @click="toggle"
    />
    <Menu
      ref="menuRef"
      :model="items"
      popup
      :pt="{ root: PANEL_CLASS, itemLabel: 'font-medium whitespace-nowrap' }"
    />
  </div>
</template>
