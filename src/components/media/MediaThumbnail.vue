<script setup lang="ts">
import type { MediaAsset } from "@/core/types/media";
import { MediaUtils } from "@/core/utils/MediaUtils";

/**
 * Thumbnail of a library media item. Videos show only the first frame:
 * playback is left to preview/live.
 */
const props = defineProps<{ asset: MediaAsset }>();
</script>

<template>
  <template v-if="props.asset.kind === 'video'">
    <video
      :src="`${MediaUtils.urlOf(props.asset)}#t=0.001`"
      preload="metadata"
      muted
      playsinline
      :aria-label="props.asset.name"
      class="pointer-events-none h-full w-full object-cover"
    />
    <i
      class="pi pi-video pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-surface p-1 text-xs"
      aria-hidden="true"
    />
  </template>
  <img
    v-else
    :src="props.asset.dataUrl"
    :alt="props.asset.name"
    draggable="false"
    class="h-full w-full object-cover"
  />
</template>
