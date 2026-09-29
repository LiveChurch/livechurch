<script setup lang="ts">
import WatermarkOverlay from "@/components/slides/WatermarkOverlay.vue";
import type { WatermarkSettings } from "@/core/types/watermark";

/** Watermark preview over a slide frame, in the same component used on air. */
defineProps<{
  settings: WatermarkSettings;
}>();
</script>

<template>
  <div class="@container relative aspect-video w-full overflow-hidden rounded-md bg-media">
    <WatermarkOverlay :settings="settings" />
  </div>
</template>
