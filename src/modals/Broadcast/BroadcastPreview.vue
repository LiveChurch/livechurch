<script setup lang="ts">
import { computed } from "vue";
import LowerThird from "@/components/broadcast/LowerThird.vue";
import LiveOutput from "@/components/slides/LiveOutput.vue";
import { provideVideoRole } from "@/components/slides/SlideDisplay/videoRole";
import { useBroadcastStore } from "@/core/state/broadcast/broadcastStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { BroadcastMode } from "@/core/types/broadcast";
import type { LiveContent, Slide } from "@/core/types/playlist";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Preview of the broadcast window: the on-air slide or, without one, a sample verse in the current theme. */
defineProps<{ mode: BroadcastMode }>();

const broadcast = useBroadcastStore();
const playlist = usePlaylistStore();
const theme = useThemeStore();
provideVideoRole("monitor");

const SAMPLE_SLIDE: Slide = {
  title: t("modals.broadcast.sampleTitle"),
  text: t("modals.broadcast.sampleText"),
};

const content = computed<LiveContent>(
  () =>
    playlist.state.liveContent ?? {
      slides: [SAMPLE_SLIDE],
      slideIndex: 0,
      slide: SAMPLE_SLIDE,
      theme: theme.state.currentTheme,
      itemType: "bible",
      bibleVersion: playlist.state.activeBibleVersion,
      playlistItemId: null,
    },
);
</script>

<template>
  <div
    class="relative flex aspect-video overflow-hidden rounded-md border border-border"
    :style="{ backgroundColor: broadcast.state.style.keyColor }"
    :aria-label="t('modals.broadcast.previewLabel')"
    role="img"
  >
    <LiveOutput v-if="mode === 'live'" :content="content" />
    <LowerThird v-else :content="content" :broadcast-style="broadcast.state.style" />
  </div>
</template>
