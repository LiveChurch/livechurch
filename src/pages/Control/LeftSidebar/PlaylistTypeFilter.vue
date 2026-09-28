<script setup lang="ts">
/** Icon button that opens a menu to filter the playlist list by type. */
import { computed, ref } from "vue";
import Button from "primevue/button";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import { usePlaylistGroupsStore } from "@/core/state/playlist/playlistGroupsStore";
import { usePlaylistGroups } from "./usePlaylistGroups";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const groupsStore = usePlaylistGroupsStore();
const { groups } = usePlaylistGroups();
const menuRef = ref<InstanceType<typeof Menu> | null>(null);

const activeGroup = computed(() =>
  groups.value.find((group) => group.id === groupsStore.state.activeGroupId),
);

const icon = computed(() => (activeGroup.value ? "pi pi-filter-fill" : "pi pi-filter"));
const label = computed(() =>
  activeGroup.value ? t("control.playlist.filtering", { label: activeGroup.value.label }) : t("control.playlist.filterByType"),
);

const items = computed<MenuItem[]>(() => [
  {
    label: t("control.playlist.allItems"),
    icon: "pi pi-list",
    active: !activeGroup.value,
    command: () => groupsStore.actions.setActiveGroup(null),
  },
  ...groups.value.map((group) => ({
    label: group.label,
    icon: "pi pi-tag",
    active: group.id === activeGroup.value?.id,
    command: () => groupsStore.actions.setActiveGroup(group.id),
  })),
]);

type ItemPtOptions = { context: { item: MenuItem } };
const isActive = ({ context }: ItemPtOptions) => context.item.active === true;

const PT = {
  root: "min-w-44 rounded-xl border border-border bg-surface p-1 shadow-2xl",
  itemContent: (options: ItemPtOptions) =>
    isActive(options) ? "bg-primary/15 hover:bg-primary/20" : "",
  itemIcon: (options: ItemPtOptions) => (isActive(options) ? "text-primary" : ""),
  itemLabel: (options: ItemPtOptions) =>
    isActive(options)
      ? "font-semibold whitespace-nowrap text-primary"
      : "font-medium whitespace-nowrap",
};

const toggle = (event: Event) => menuRef.value?.toggle(event);
</script>

<template>
  <div class="flex items-center">
    <Button
      type="button"
      variant="text"
      severity="secondary"
      class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/30 hover:text-surface-foreground"
      :icon="icon"
      :title="label"
      :aria-label="label"
      aria-haspopup="true"
      @click="toggle"
    />
    <Menu
      ref="menuRef"
      :model="items"
      popup
      :pt="PT"
    />
  </div>
</template>
