<script setup lang="ts">
import LowerThird from "@/components/broadcast/LowerThird.vue";
import LiveOutput from "@/components/slides/LiveOutput.vue";
import { provideVideoRole } from "@/components/slides/SlideDisplay/videoRole";
import { useBroadcastStyle } from "@/core/composables/useBroadcastStyle";
import { useLivePayload } from "@/core/composables/useLivePayload";
import type { BroadcastMode } from "@/core/types/broadcast";

/**
 * Window captured by OBS: only the caption over the chroma key color,
 * or the whole live output. Videos follow the live one without sound (the sound comes from the projector).
 */
defineProps<{ mode: BroadcastMode }>();

const { content } = useLivePayload();
const { style } = useBroadcastStyle();
provideVideoRole("monitor");
</script>

<template>
  <div class="flex h-screen select-none overflow-hidden">
    <LiveOutput v-if="mode === 'live'" :content="content" />
    <div v-else class="relative flex flex-1" :style="{ backgroundColor: style.keyColor }">
      <LowerThird :content="content" :broadcast-style="style" />
    </div>
  </div>
</template>
