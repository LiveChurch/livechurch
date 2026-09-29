<script setup lang="ts">
import { ref, watch } from "vue";
import { useVideoPlayback } from "./useVideoPlayback";
import { useVideoRole } from "./videoRole";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{ url: string }>();

const role = useVideoRole();
const videoRef = ref<HTMLVideoElement | null>(null);
const hasFailed = ref(false);

useVideoPlayback(videoRef, role);

watch(
  () => props.url,
  () => {
    hasFailed.value = false;
  },
);
</script>

<template>
  <video
    ref="videoRef"
    :src="props.url"
    :muted="role !== 'output'"
    :autoplay="role !== 'preview'"
    playsinline
    preload="auto"
    class="absolute inset-0 h-full w-full object-contain"
    @error="hasFailed = true"
  />
  <p
    v-if="hasFailed"
    class="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-muted-foreground"
  >
    {{ t('components.slides.videoFailed') }}
  </p>
</template>
