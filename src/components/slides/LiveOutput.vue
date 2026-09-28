<script setup lang="ts">
import NoticeBanner from "@/components/slides/NoticeBanner.vue";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import WatermarkOverlay from "@/components/slides/WatermarkOverlay.vue";
import { useWatermarkSettings } from "@/core/composables/useWatermarkSettings";
import type { LiveNotice } from "@/core/types/live";
import type { LiveContent } from "@/core/types/playlist";

/** Live output image: the on-air slide with the notice on top. Fills the parent (flex). */
defineProps<{
  content: (LiveContent & { notice?: LiveNotice | null }) | null;
}>();

const { settings: watermarkSettings } = useWatermarkSettings();
</script>

<template>
  <div
    class="@container relative flex flex-1 select-none flex-col items-center justify-center overflow-hidden border-none bg-media text-center"
  >
    <SlideDisplay
      v-if="content"
      :slide="content.slide"
      :slides="content.slides"
      :current-index="content.slideIndex"
      :theme="content.theme"
      :slide-type="content.itemType"
      :bible-version="content.bibleVersion"
      :playlist-item-id="content.playlistItemId ?? undefined"
      :background-seed="content.backgroundSeed"
    />
    <NoticeBanner :notice="content?.notice" />
    <WatermarkOverlay :settings="watermarkSettings" />
  </div>
</template>
