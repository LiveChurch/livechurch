<script setup lang="ts">
import type { LiveNotice } from "@/core/types/live";
import { cn } from "@/core/utils/ClassNameUtils";
import NoticeMarquee from "./NoticeMarquee.vue";

/**
 * Notice band overlaid on the slide. Sized by the container (`cqw`),
 * so the parent must be a `@container` with `relative`.
 */
defineProps<{
  notice: LiveNotice | null | undefined;
}>();

/** Default font size, in % of the container width. */
const BASE_FONT_CQW = 3;
</script>

<template>
  <Transition name="notice">
    <div
      v-if="notice"
      :class="
        cn(
          'absolute inset-x-0 z-40 flex justify-center py-[0.5em] text-center',
          notice.position === 'top' ? 'top-0' : 'bottom-0',
          notice.effect !== 'marquee' && 'px-[1.3em]',
        )
      "
      :style="{
        backgroundColor: notice.backgroundColor,
        color: notice.textColor,
        fontSize: `${BASE_FONT_CQW * notice.fontScale}cqw`,
      }"
      role="status"
    >
      <NoticeMarquee
        v-if="notice.effect === 'marquee'"
        :text="notice.text"
        :speed="notice.marqueeSpeed"
      />
      <p v-else class="whitespace-pre-line break-words font-bold leading-tight">
        {{ notice.text }}
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.notice-enter-active,
.notice-leave-active {
  transition: opacity 0.3s;
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
}
</style>
