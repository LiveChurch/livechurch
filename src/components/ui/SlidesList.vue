<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { cn } from "@/core/utils/ClassNameUtils";
import { useSlidesListNavigation } from "./useSlidesListNavigation";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Column of slides of the active item (port of `src/components/ui/SlidesList.tsx`).
 * Keyboard navigation + scroll-into-view via useSlidesListNavigation().
 */
const playlistCtx = usePlaylistStore();
const state = playlistCtx.state;
const actions = playlistCtx.actions;

useSlidesListNavigation();

const isBibleVerse = computed(() => state.activeItem?.type === "bible-verse");
const currentChapter = computed(() =>
  isBibleVerse.value
    ? parseInt(state.activeItem?.bibleData?.chapter || "0")
    : null,
);
const previousLabel = computed(() =>
  currentChapter.value ? currentChapter.value - 1 : null,
);
const nextLabel = computed(() =>
  currentChapter.value ? currentChapter.value + 1 : null,
);

const onChapterKeyDown =
  (go: () => void) =>
  (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      go();
    }
  };
</script>

<template>
  <div
    class="w-80 h-full flex flex-col shrink-0 rounded-lg border border-border bg-surface/80 overflow-hidden shadow-xl"
  >
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <div
        v-if="isBibleVerse"
        class="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur"
      >
        <div
          class="px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted font-semibold"
        >
          {{ state.activeItem?.bibleData?.book }}
          {{ state.activeItem?.bibleData?.chapter }}
        </div>
        <div
          v-if="state.canGoToPreviousChapter && previousLabel"
          role="button"
          :tabindex="0"
          class="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-xs font-semibold text-surface-foreground/80 transition hover:bg-surface-light/30 focus:outline-none focus:ring-1 focus:ring-primary/60"
          @click="actions.goToPreviousChapter()"
          @keydown="onChapterKeyDown(actions.goToPreviousChapter)"
        >
          <span
            class="flex items-center gap-2 uppercase tracking-[0.2em] text-xs text-muted"
          >
            <AppIcon name="app~chevronLeft" size="12px" />
            {{ t('components.slidesList.goToChapter', { label: previousLabel }) }}
          </span>
        </div>
      </div>

      <template v-if="state.activeItem">
        <div
          v-for="(slide, index) in state.slides"
          :key="index"
          :class="
            cn(
              'px-4 py-3 border-b border-border/60 cursor-pointer group',
              index === state.activeSlideIndex
                ? 'active-slide-sidebar bg-brand text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]'
                : 'text-muted-foreground hover:bg-surface-light/30 hover:text-surface-foreground',
            )
          "
          @click="actions.setActiveSlideIndex(index)"
        >
          <p class="text-sm leading-relaxed whitespace-pre-line">
            {{ slide.text }}
          </p>
        </div>

        <div
          v-if="state.slides.length === 0"
          class="p-8 text-center text-muted"
        >
          <p class="text-xs uppercase tracking-widest font-bold">
            {{ state.activeItem.name }}
          </p>
          <p class="text-xs mt-2 opacity-50">{{ t('components.slidesList.noSlides') }}</p>
        </div>
      </template>

      <div
        v-if="isBibleVerse && state.canGoToNextChapter && nextLabel"
        class="sticky bottom-0 z-10 border-t border-border bg-surface/90 backdrop-blur"
      >
        <div
          role="button"
          :tabindex="0"
          class="flex items-center justify-between gap-3 px-4 py-3 text-xs font-semibold text-surface-foreground/80 transition hover:bg-surface-light/30 focus:outline-none focus:ring-1 focus:ring-primary/60"
          @click="actions.goToNextChapter()"
          @keydown="onChapterKeyDown(actions.goToNextChapter)"
        >
          <span
            class="flex items-center gap-2 uppercase tracking-[0.2em] text-xs text-muted"
          >
            {{ t('components.slidesList.goToChapter', { label: nextLabel }) }}
          </span>
          <AppIcon name="app~chevronRight" size="12px" class="text-muted" />
        </div>
      </div>
    </div>
  </div>
</template>
