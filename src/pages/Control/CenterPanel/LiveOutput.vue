<script setup lang="ts">
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import OutputPane from "./OutputPane.vue";
import StopLiveButton from "./StopLiveButton.vue";
import ThemePicker from "./ThemePicker.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Column of what is on air: live output, shortcut to focus it in the preview and the active item's theme. */
const { state, actions } = usePlaylistStore();
</script>

<template>
  <aside class="flex w-96 shrink-0 flex-col gap-2 min-h-0 overflow-hidden">
    <OutputPane
      anchor-top
      class="shrink-0 rounded-lg border border-border bg-surface overflow-hidden"
      :label="t('control.centerPanel.liveOutput')"
      :headline="state.liveContent?.slide.title || t('control.centerPanel.nothingLive')"
      :slide="state.liveContent?.slide ?? null"
      :slides="state.liveContent?.slides"
      :current-index="state.liveContent?.slideIndex"
      :theme="state.liveContent?.theme"
      :slide-type="state.liveContent?.itemType"
      :bible-version="state.liveContent?.bibleVersion"
      :playlist-item-id="state.liveContent?.playlistItemId ?? undefined"
      :background-seed="state.liveContent?.backgroundSeed"
      :notice="state.notice"
      :empty-message="t('control.centerPanel.nothingLive')"
      video-role="monitor"
      fullscreenable
    >
      <template #actions>
        <StopLiveButton />
      </template>
      <template #footer>
        <Button
          type="button"
          outlined
          size="small"
          severity="secondary"
          :label="t('control.centerPanel.moveToPreview')"
          icon="pi pi-eye"
          :title="t('control.centerPanel.moveToPreviewHint')"
          :disabled="!state.canFocusLive"
          @click="actions.focusLiveInPreview"
        />
      </template>
    </OutputPane>
    <ThemePicker />
  </aside>
</template>
