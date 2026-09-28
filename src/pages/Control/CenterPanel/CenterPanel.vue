<script setup lang="ts">
/**
 * Center panel (port of `src/pages/Control/CenterPanel/index.tsx`):
 * SlidesList + Preview + Live (fixed width) with the theme selector.
 *
 * The theme bar (ThemeToolbar + ThemeSectionPanel) was removed
 * temporarily; the components remain in `components/theme-selector`.
 */
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import SlidesList from "@/components/ui/SlidesList.vue";
import { useCenterPanelTheme } from "./useCenterPanelTheme";
import { useCenterPanelLive } from "./useCenterPanelLive";
import { useGoLiveShortcut } from "./useGoLiveShortcut";
import OutputPane from "./OutputPane.vue";
import SlideNavigation from "./SlideNavigation.vue";
import LiveOutput from "./LiveOutput.vue";
import StopLiveButton from "./StopLiveButton.vue";
import BackgroundButton from "./BackgroundButton.vue";
import VideoControls from "./VideoControls.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { state } = usePlaylistStore();

const { resolvedTheme } = useCenterPanelTheme();

const {
  previewSlide,
  isPreviewLive,
  previewHeadline,
  canEditSlides,
  canPauseLive,
  handleEditSlides,
  handleGoLive,
  handlePauseLive,
} = useCenterPanelLive(resolvedTheme);

useGoLiveShortcut(handleGoLive);
</script>

<template>
  <main class="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
    <div class="flex min-h-0 flex-1 gap-2">
      <SlidesList v-if="state.slides.length > 1" />

      <div class="flex min-w-0 flex-1 justify-center overflow-hidden">
        <div class="mx-auto flex min-h-0 w-full max-w-[1480px] flex-1 gap-2">
          <OutputPane
            class="min-w-0 rounded-lg border border-border bg-surface overflow-hidden"
            :label="t('control.centerPanel.previewOutput')"
            :headline="previewHeadline"
            :slide="previewSlide"
            :slides="state.slides"
            :current-index="state.activeSlideIndex"
            :theme="resolvedTheme"
            :slide-type="state.activeItem?.type"
            :playlist-item-id="state.activeItem?.id"
            :background-seed="state.activeItem?.backgroundSeed"
            :notice="state.notice"
            :empty-message="t('control.centerPanel.waitingSelection')"
            video-role="preview"
          >
            <template v-if="isPreviewLive" #badge>
              <span class="shrink-0 text-xs font-medium text-brand">
                {{ t('control.centerPanel.live') }}
              </span>
            </template>
            <template #actions>
              <div class="flex items-center gap-2">
                <Button
                  v-if="canEditSlides"
                  type="button"
                  class="p-button-glass"
                  size="small"
                  :disabled="!state.activeItem"
                  :aria-label="t('control.centerPanel.editSlides')"
                  icon="pi pi-pencil"
                  :title="t('control.centerPanel.editSlidesShortcut')"
                  @click="handleEditSlides"
                />
                <Button
                  v-if="canPauseLive"
                  type="button"
                  class="p-button-glass"
                  size="small"
                  severity="warn"
                  :aria-label="t('control.centerPanel.pauseOnScreen')"
                  icon="pi pi-pause"
                  :title="t('control.centerPanel.pauseOnSlide')"
                  @click="handlePauseLive"
                />
                <Button
                  v-else
                  type="button"
                  class="p-button-glass"
                  size="small"
                  severity="success"
                  :disabled="!state.activeItem"
                  :aria-label="t('control.centerPanel.showOnScreen')"
                  icon="pi pi-play"
                  :title="t('control.centerPanel.showOnScreenShortcut')"
                  @click="handleGoLive"
                />
                <StopLiveButton />
              </div>
            </template>
            <template v-if="state.slides.length" #toolbar>
              <SlideNavigation />
            </template>
            <template v-if="previewSlide?.media" #footer>
              <VideoControls v-if="previewSlide.media.kind === 'video'" />
              <BackgroundButton />
            </template>
          </OutputPane>

          <LiveOutput />
        </div>
      </div>
    </div>
  </main>
</template>
