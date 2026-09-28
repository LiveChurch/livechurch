<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import type { Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Thumbnail of a theme (the slide itself, no name) with clone/remove actions. */
defineProps<{ theme: SlidesTheme; selected: boolean; canRemove: boolean }>();

const emit = defineEmits<{ select: []; clone: []; remove: [] }>();

const SAMPLE_SLIDE = computed<Slide>(() => ({ title: "", text: t("common.terms.previewText1") }));
</script>

<template>
  <div
    role="button"
    tabindex="0"
    :title="theme.name || 'Tema sem nome'"
    :aria-label="theme.name || 'Tema sem nome'"
    :aria-pressed="selected"
    :class="
      cn(
        'group relative aspect-video shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-media outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/60',
        selected ? 'border-brand ring-2 ring-brand/50' : 'border-border hover:border-brand',
      )
    "
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
  >
    <SlideDisplay class="pointer-events-none" :slide="SAMPLE_SLIDE" :theme="theme" preview-mode="compact" />

    <div
      class="dark-mode absolute right-2 top-2 z-40 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <Button
        rounded
        size="small"
        severity="secondary"
        icon="pi pi-clone"
        :aria-label="t('modals.globalThemes.cloneTheme')"
        @click.stop="emit('clone')"
      />
      <Button
        v-if="canRemove"
        rounded
        size="small"
        severity="danger"
        icon="pi pi-trash"
        :aria-label="t('modals.globalThemes.removeTheme')"
        @click.stop="emit('remove')"
      />
    </div>
  </div>
</template>
