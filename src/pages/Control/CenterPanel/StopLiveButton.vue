<script setup lang="ts">
import { nextTick } from "vue";
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useVideoPlayerStore } from "@/core/state/video/videoPlayerStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Takes what is playing off air; goes back to the background, if there is one. */
const { state, actions } = usePlaylistStore();
const videoPlayer = useVideoPlayerStore();

const handleStop = async () => {
  await actions.stopLive();
  if (state.liveContent?.slide.media?.kind !== "video") return;
  // The standby screen's video preview only exists after the screen updates.
  await nextTick();
  videoPlayer.actions.restart();
};
</script>

<template>
  <Button
    type="button"
    class="p-button-glass"
    size="small"
    severity="danger"
    :aria-label="t('control.centerPanel.stopLive')"
    icon="pi pi-stop"
    :title="t('control.centerPanel.stopLive')"
    :disabled="!state.canStopLive"
    @click="handleStop"
  />
</template>
