<script setup lang="ts">
import { ref } from "vue";
import { NOTICE_MARQUEE_SECONDS_PER_SCREEN } from "@/core/constants/notice";
import type { NoticeMarqueeSpeed } from "@/core/types/live";
import { useMarqueeDuration } from "./useMarqueeDuration";

/**
 * Text scrolling in a loop, from right to left (TV news ticker style).
 * Two copies side by side slide half a track per lap, so the loop has no seam.
 */
const props = defineProps<{
  text: string;
  speed: NoticeMarqueeSpeed;
}>();

const containerRef = ref<HTMLElement | null>(null);
const segmentRef = ref<HTMLElement | null>(null);
const duration = useMarqueeDuration(
  containerRef,
  segmentRef,
  () => NOTICE_MARQUEE_SECONDS_PER_SCREEN[props.speed],
);
</script>

<template>
  <div ref="containerRef" class="flex min-w-0 flex-1 overflow-hidden">
    <div class="marquee-track flex shrink-0" :style="{ animationDuration: duration }">
      <p
        ref="segmentRef"
        class="min-w-[100cqw] shrink-0 whitespace-nowrap pr-[3em] font-bold leading-tight"
      >
        {{ text }}
      </p>
      <p
        class="min-w-[100cqw] shrink-0 whitespace-nowrap pr-[3em] font-bold leading-tight"
        aria-hidden="true"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  animation: marquee-scroll linear infinite;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
