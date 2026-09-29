<script setup lang="ts">
/**
 * Footer with clock, modal shortcuts and Bible/monitor menus
 * (port of `src/pages/Control/StatusBar/index.tsx`).
 */
import { computed } from "vue";
import Button from "primevue/button";
import { APP_VERSION } from "@/core/constants/appVersion";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import BroadcastModal from "@/modals/Broadcast/BroadcastModal.vue";
import CalendarModal from "@/modals/Calendar/CalendarModal.vue";
import GlobalThemesModal from "@/modals/GlobalThemes/GlobalThemesModal.vue";
import NoticeModal from "@/modals/Notice/NoticeModal.vue";
import WatermarkModal from "@/modals/Watermark/WatermarkModal.vue";
import { openModal } from "@/modals/openModal";
import { useWatermarkStore } from "@/core/state/watermark/watermarkStore";
import BibleVersionMenu from "./BibleVersionMenu.vue";
import ClockDate from "./ClockDate.vue";
import QuickBibleButton from "./QuickBibleButton.vue";
import MonitorMenu from "./MonitorMenu.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlistCtx = usePlaylistStore();
const isNoticeOnAir = computed(() => !!playlistCtx.state.notice);

const watermarkCtx = useWatermarkStore();
const isWatermarkOn = computed(() => watermarkCtx.state.settings.enabled);

const openCalendar = () => openModal(CalendarModal);
const openNotice = () => openModal(NoticeModal);
const openGlobalThemes = () => openModal(GlobalThemesModal);
const openBroadcast = () => openModal(BroadcastModal);
const openWatermark = () => openModal(WatermarkModal);
</script>

<template>
  <footer
    class="relative z-70 flex h-9 shrink-0 select-none items-center border-t border-border bg-surface text-xs text-muted-foreground backdrop-blur"
  >
    <ClockDate />

    <!-- <span class="font-mono text-sm text-surface-foreground/80">
      Atenção! Programa em fase beta, pode apresentar instabilidades ou bugs.
      Dê-nos seu feedback
    </span> -->

    <div class="ml-auto flex items-center gap-4 px-4 text-xs text-muted-foreground/80">
      <Button
        variant="text"
        severity="secondary"
        rounded
        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground"
        :title="t('control.statusBar.openCalendarTitle')"
        :aria-label="t('control.statusBar.openCalendar')"
        icon="pi pi-calendar"
        @click="openCalendar"
      />

      <Button
        variant="text"
        severity="secondary"
        rounded
        :class="[
          'rounded-lg p-1.5 transition-colors hover:bg-surface-light/60 hover:text-surface-foreground',
          isNoticeOnAir ? 'text-brand' : 'text-muted-foreground',
        ]"
        :title="t('control.statusBar.notice')"
        :aria-label="t('control.statusBar.configureNotice')"
        icon="pi pi-megaphone"
        @click="openNotice"
      />

      <Button
        variant="text"
        severity="secondary"
        rounded
        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground"
        :title="t('control.statusBar.broadcast')"
        :aria-label="t('control.statusBar.configureBroadcast')"
        icon="pi pi-video"
        @click="openBroadcast"
      />

      <Button
        variant="text"
        severity="secondary"
        rounded
        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground"
        :title="t('control.statusBar.openGlobalThemes')"
        :aria-label="t('control.statusBar.openGlobalThemes')"
        icon="pi pi-palette"
        @click="openGlobalThemes"
      />

      <Button
        variant="text"
        severity="secondary"
        rounded
        :class="[
          'rounded-lg p-1.5 transition-colors hover:bg-surface-light/60 hover:text-surface-foreground',
          isWatermarkOn ? 'text-brand' : 'text-muted-foreground',
        ]"
        :title="t('control.statusBar.watermark')"
        :aria-label="t('control.statusBar.configureWatermark')"
        icon="pi pi-image"
        @click="openWatermark"
      />

      <QuickBibleButton />
      <BibleVersionMenu />
      <MonitorMenu />
    </div>

    <div class="flex items-center gap-3 px-4">
      <span class="text-xs text-muted-foreground/80">LiveChurch v{{ APP_VERSION }}</span>
    </div>
  </footer>
</template>
