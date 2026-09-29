<script setup lang="ts">
import { computed } from "vue";
import type { WatermarkSettings } from "@/core/types/watermark";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Fixed logo overlaid on the slide, at the configured corner/edge. Sized by the
 * container (`cqw`), so the parent must be a `@container` with `relative`
 * (same contract as `NoticeBanner.vue`).
 */
const props = defineProps<{
  settings: WatermarkSettings | null | undefined;
}>();

/** Distance from the container edge, in % of the width (cqw). */
const MARGIN_CQW = 2.5;

const style = computed(() => {
  const settings = props.settings;
  if (!settings) return {};

  const margin = `${MARGIN_CQW}cqw`;
  const isTop = settings.position.startsWith("top-");
  const isBottom = settings.position.startsWith("bottom-");
  const isLeft = settings.position.endsWith("-left");
  const isRight = settings.position.endsWith("-right");
  const isMiddleV = settings.position.startsWith("middle-");
  const isCenterH = settings.position.endsWith("-center");

  return {
    width: `${settings.sizePercent}cqw`,
    opacity: String(settings.opacity),
    top: isTop ? margin : isMiddleV ? "50%" : undefined,
    bottom: isBottom ? margin : undefined,
    left: isLeft ? margin : isCenterH ? "50%" : undefined,
    right: isRight ? margin : undefined,
    transform: `translate(${isCenterH ? "-50%" : "0"}, ${isMiddleV ? "-50%" : "0"})`,
  };
});
</script>

<template>
  <img
    v-if="settings?.enabled && settings.imageUrl"
    :src="settings.imageUrl"
    :alt="t('control.statusBar.watermark')"
    class="pointer-events-none absolute z-50 select-none object-contain"
    :style="style"
  />
</template>
