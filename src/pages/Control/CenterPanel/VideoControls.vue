<script setup lang="ts">
import Button from "primevue/button";
import Slider from "primevue/slider";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useVideoPlayerStore } from "@/core/state/video/videoPlayerStore";
import { TimeUtils } from "@/core/utils/TimeUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Controls of the previewed video (and of the live one, when the preview is what is on air). */
const player = useVideoPlayerStore();

const togglePlay = () => {
  if (player.state.isPlaying) player.actions.pause();
  else player.actions.play();
};

const seekTo = (value: number | number[] | undefined) => {
  if (typeof value === "number") player.actions.seek(value);
};
</script>

<template>
  <div
    class="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5"
  >
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="t('control.video.restart')"
      :title="t('control.video.restart')"
      @click="player.actions.restart()"
    >
      <template #icon><AppIcon name="restart_alt" size="20px" /></template>
    </Button>
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="t('control.video.back10')"
      :title="t('control.video.back10')"
      @click="player.actions.skipBackward()"
    >
      <template #icon><AppIcon name="replay_10" size="20px" /></template>
    </Button>
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="player.state.isPlaying ? t('control.video.pause') : t('control.video.play')"
      :title="player.state.isPlaying ? t('control.video.pause') : t('control.video.play')"
      @click="togglePlay"
    >
      <template #icon>
        <AppIcon
          :name="player.state.isPlaying ? 'pause' : 'play_arrow'"
          size="24px"
        />
      </template>
    </Button>
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="t('control.video.forward10')"
      :title="t('control.video.forward10')"
      @click="player.actions.skipForward()"
    >
      <template #icon><AppIcon name="forward_10" size="20px" /></template>
    </Button>

    <span class="w-12 text-center text-xs tabular-nums text-muted-foreground">
      {{ TimeUtils.formatClock(player.state.currentTime) }}
    </span>
    <Slider
      :model-value="player.state.currentTime"
      :max="player.state.duration"
      :step="0.1"
      :disabled="player.state.duration === 0"
      :aria-label="t('control.video.timeline')"
      class="min-w-0 flex-1"
      @update:model-value="seekTo"
    />
    <span class="w-12 text-center text-xs tabular-nums text-muted-foreground">
      {{ TimeUtils.formatClock(player.state.duration) }}
    </span>
  </div>
</template>
