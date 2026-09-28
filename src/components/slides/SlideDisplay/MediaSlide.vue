<script setup lang="ts">
import type { SlideMedia } from "@/core/types/media";
import VideoSlide from "./VideoSlide.vue";

defineProps<{
  media: SlideMedia;
  alt: string;
  itemId?: string;
}>();
</script>

<template>
  <Transition name="media-slide" appear>
    <div
      :key="itemId"
      class="absolute inset-0 select-none overflow-hidden bg-media"
    >
      <VideoSlide v-if="media.kind === 'video'" :url="media.url" />
      <img
        v-else
        :src="media.url"
        :alt="alt"
        draggable="false"
        class="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  </Transition>
</template>

<style scoped>
.media-slide-enter-active {
  transition: opacity 0.4s;
}

.media-slide-enter-from {
  opacity: 0;
}

.media-slide-leave-active {
  display: none;
}
</style>
