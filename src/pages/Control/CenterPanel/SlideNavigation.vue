<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Back, restart and advance slide of the active item. */
const { state, actions } = usePlaylistStore();

const isFirst = computed(() => state.activeSlideIndex <= 0);
const isLast = computed(
  () => state.activeSlideIndex >= state.slides.length - 1,
);
</script>

<template>
  <div class="flex items-center justify-end gap-2">
    <Button
      type="button"
      outlined
      size="small"
      severity="secondary"
      icon="pi pi-chevron-left"
      :aria-label="t('control.centerPanel.previousSlide')"
      :title="t('control.centerPanel.previousSlide')"
      :disabled="isFirst"
      @click="actions.setActiveSlideIndex(state.activeSlideIndex - 1)"
    />
    <Button
      type="button"
      outlined
      size="small"
      severity="secondary"
      icon="pi pi-replay"
      :aria-label="t('control.centerPanel.restartFromFirst')"
      :title="t('control.centerPanel.restartFromFirst')"
      :disabled="isFirst"
      @click="actions.setActiveSlideIndex(0)"
    />
    <Button
      type="button"
      outlined
      size="small"
      severity="secondary"
      icon="pi pi-chevron-right"
      :aria-label="t('control.centerPanel.nextSlide')"
      :title="t('control.centerPanel.nextSlide')"
      :disabled="isLast"
      @click="actions.setActiveSlideIndex(state.activeSlideIndex + 1)"
    />
  </div>
</template>
