<script setup lang="ts">
/**
 * Frameless window title bar (port of `src/pages/Control/TitleBar.tsx`).
 * Uses -webkit-app-region: drag via a Tailwind arbitrary class, as in React.
 */
import Button from "primevue/button";
import { useWindowControls } from "@/core/composables/useWindowControls";
import TitleBarMenu from "./TitleBarMenu.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();

const titleActionsBtnClass = "h-full w-12 rounded-none transition-all duration-200 [-webkit-app-region:no-drag] text-muted-foreground hover:bg-surface-light/30 hover:text-surface-foreground";
</script>

<template>
  <div
    class="flex h-8 w-full shrink-0 cursor-default select-none items-center justify-between bg-surface [-webkit-app-region:drag]"
  >
    <div class="flex h-full items-center">
      <TitleBarMenu />
      <div class="flex items-center gap-3 px-2 pointer-events-none">
        <span
          class="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground"
        >
          LiveChurch
        </span>
        <span
          class="rounded-sm bg-warning/90 px-2 py-0.5 text-xs font-black uppercase tracking-[0.3em] text-warning-foreground shadow shadow-warning/30"
        >
          Beta
        </span>
      </div>
    </div>

    <div class="flex h-full items-center">
      <Button
        type="button"
        variant="text"
        severity="secondary"
        :title="t('control.titleBar.minimize')"
        :aria-label="t('control.titleBar.minimize')"
        icon="pi pi-minus"
        :class="titleActionsBtnClass"
        @click="minimize"
      />
      <Button
        type="button"
        variant="text"
        severity="secondary"
        :title="isMaximized ? t('control.titleBar.restore') : t('control.titleBar.maximize')"
        :aria-label="isMaximized ? t('control.titleBar.restore') : t('control.titleBar.maximize')"
        :icon="isMaximized ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
        :class="titleActionsBtnClass"
        @click="toggleMaximize"
      />
      <Button
        type="button"
        variant="text"
        severity="secondary"
        :title="t('common.actions.close')"
        :aria-label="t('common.actions.close')"
        icon="pi pi-times"
        :class="titleActionsBtnClass"
        @click="close"
      />
    </div>
  </div>
</template>
