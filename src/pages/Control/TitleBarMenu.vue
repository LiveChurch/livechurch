<script setup lang="ts">
/**
 * Hamburger button of the title bar that opens the app menu
 * (PrimeVue's TieredMenu in popup mode, with cascading submenus).
 */
import { ref } from "vue";
import Button from "primevue/button";
import TieredMenu from "primevue/tieredmenu";
import { useTitleBarMenuItems } from "./useTitleBarMenuItems";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const menuRef = ref<InstanceType<typeof TieredMenu> | null>(null);
const items = useTitleBarMenuItems();

const PANEL_CLASS =
  "min-w-44 rounded-xl border border-border bg-surface p-1 shadow-2xl";

const toggle = (event: Event) => menuRef.value?.toggle(event);
</script>

<template>
  <Button
    type="button"
    variant="text"
    severity="secondary"
    :title="t('control.titleBar.menu')"
    :aria-label="t('control.titleBar.menu')"
    aria-haspopup="true"
    icon="pi pi-bars"
    class="h-full w-12 rounded-none text-muted-foreground transition-all duration-200 [-webkit-app-region:no-drag] hover:bg-surface-light/30 hover:text-surface-foreground"
    @click="toggle"
  />
  <TieredMenu
    ref="menuRef"
    :model="items"
    popup
    :pt="{
      root: PANEL_CLASS,
      submenu: PANEL_CLASS,
      itemLabel: 'font-medium whitespace-nowrap',
    }"
  />
</template>
