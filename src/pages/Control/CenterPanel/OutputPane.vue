<script setup lang="ts">
// API: data props + named slots "badge" and "actions"
// (replace the original's `badge`/`actions` ReactNodes).
import type {
  BibleVersion,
  PlaylistItemType,
  Slide,
} from "@/core/types/playlist";
import type { LiveNotice } from "@/core/types/live";
import type { SlidesTheme } from "@/core/types/theme";
import NoticeBanner from "@/components/slides/NoticeBanner.vue";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import WatermarkOverlay from "@/components/slides/WatermarkOverlay.vue";
import {
  provideVideoRole,
  type VideoRole,
} from "@/components/slides/SlideDisplay/videoRole";
import { useWatermarkStore } from "@/core/state/watermark/watermarkStore";
import { cn } from "@/core/utils/ClassNameUtils";
import Button from "primevue/button";
import { useI18n } from "vue-i18n";
import { useFrameFullscreen } from "./useFrameFullscreen";

/**
 * Output frame (preview or live) with header and SlideDisplay
 * (port of `src/pages/Control/CenterPanel/OutputPane.tsx`).
 */
const props = withDefaults(
  defineProps<{
    label: string;
    headline: string;
    slide: Slide | null;
    emptyMessage: string;
    slides?: Slide[];
    currentIndex?: number;
    theme?: SlidesTheme;
    slideType?: PlaylistItemType;
    bibleVersion?: BibleVersion;
    playlistItemId?: string;
    backgroundSeed?: string;
    /** Notice overlaid on the slide (only the live output receives it). */
    notice?: LiveNotice | null;
    /** Anchors the screen to the top, without taking up the parent's remaining space. */
    anchorTop?: boolean;
    /** Role of the videos shown in this frame. */
    videoRole?: VideoRole;
    /** Clicking the screen shows it fullscreen (Esc or X to exit). */
    fullscreenable?: boolean;
  }>(),
  {
    slides: undefined,
    currentIndex: undefined,
    theme: undefined,
    slideType: undefined,
    bibleVersion: undefined,
    playlistItemId: undefined,
    backgroundSeed: undefined,
    notice: null,
    anchorTop: false,
    videoRole: "output",
    fullscreenable: false,
  },
);

provideVideoRole(props.videoRole);

const { state: watermarkState } = useWatermarkStore();
const { t } = useI18n();
const { fullscreen, enter, exit } = useFrameFullscreen();
</script>

<template>
  <section :class="cn('flex min-h-0 min-w-0 flex-col', !anchorTop && 'flex-1')">
    <div class="flex min-h-[72px] items-start justify-between px-3 pb-3 pt-6">
      <div class="min-w-0">
        <h3 class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {{ label }}
          <slot name="badge" />
        </h3>
        <p
          class="mt-2 truncate text-sm font-semibold uppercase tracking-[0.18em] text-foreground/85"
        >
          {{ headline }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button
          v-if="fullscreenable"
          type="button"
          text
          rounded
          size="small"
          severity="secondary"
          icon="pi pi-window-maximize"
          :aria-label="t('control.centerPanel.enterFullscreen')"
          :title="t('control.centerPanel.enterFullscreen')"
          @click="enter"
        />
        <slot name="actions" />
      </div>
    </div>

    <div
      :class="
        cn(
          'flex justify-center px-4 pb-4',
          anchorTop ? 'items-start' : 'flex-1 items-center',
        )
      "
    >
      <div class="flex w-full max-w-[1000px] flex-col gap-3">
        <slot name="toolbar" />
        <div
          :class="
            cn(
              '@container relative aspect-video w-full overflow-hidden bg-media',
              fullscreen && 'fixed inset-0 z-50 m-auto w-[min(100vw,177.78vh)]',
            )
          "
        >
          <SlideDisplay
            v-if="slide"
            :slide="slide"
            :slides="slides"
            :current-index="currentIndex"
            :theme="theme"
            :slide-type="slideType"
            :bible-version="bibleVersion"
            :playlist-item-id="playlistItemId"
            :background-seed="backgroundSeed"
          />
          <div
            v-else
            class="dark-mode absolute inset-0 flex items-center justify-center bg-media p-8 text-center"
          >
            <h1 class="text-lg font-medium text-muted-foreground/50">
              {{ emptyMessage }}
            </h1>
          </div>
          <NoticeBanner :notice="notice" />
          <WatermarkOverlay :settings="watermarkState.settings" />
        </div>
        <div
          v-if="fullscreen"
          class="fixed inset-0 z-40 bg-black"
          aria-hidden="true"
          @click="exit"
        />
        <Button
          v-if="fullscreen"
          type="button"
          rounded
          severity="secondary"
          icon="pi pi-times"
          class="fixed right-4 top-4 z-[60]"
          :aria-label="t('control.centerPanel.exitFullscreen')"
          @click="exit"
        />
        <slot name="footer" />
      </div>
    </div>
  </section>
</template>
