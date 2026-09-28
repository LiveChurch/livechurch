<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import SelectableCard from "@/components/ui/SelectableCard.vue";
import type { Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { useThemeVariants } from "./useThemeVariants";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Theme preview; switching slides triggers the configured transition. With
 * background rotation, shows every possibility and lets you choose which one to view.
 */
const props = defineProps<{ theme: SlidesTheme }>();

const SLIDES: Slide[] = [
  { title: t("components.themeSelector.previewTitle"), text: t("common.terms.previewText1") },
  {
    title: t("components.themeSelector.previewTitle"),
    text: t("components.themeSelector.previewText2"),
  },
];

const index = ref(0);
const slide = computed(() => SLIDES[index.value]);
const next = () => (index.value = (index.value + 1) % SLIDES.length);

const variants = useThemeVariants(() => props.theme);
const variantIndex = ref(0);
const previewTheme = computed(() => variants.value[variantIndex.value] ?? props.theme);
</script>

<template>
  <div class="custom-scrollbar flex min-h-0 flex-col gap-3 overflow-y-auto">
    <div class="relative aspect-video shrink-0 overflow-hidden rounded-lg border border-border/70 bg-media">
      <SlideDisplay
        :slide="slide"
        :slides="SLIDES"
        :current-index="index"
        :theme="previewTheme"
        preview-mode="compact"
      />
    </div>
    <Button
      variant="text"
      severity="secondary"
      size="small"
      icon="pi pi-play"
      :label="t('components.themeSelector.testTransition')"
      class="shrink-0 self-center text-muted-foreground hover:text-surface-foreground"
      @click="next"
    />

    <section v-if="variants.length > 1" class="flex flex-col gap-2">
      <h4 class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {{ t('components.themeSelector.possibilities') }}
      </h4>
      <div class="grid grid-cols-3 gap-3">
        <SelectableCard
          v-for="(variant, i) in variants"
          :key="i"
          :selected="variantIndex === i"
          @select="variantIndex = i"
        >
          <SlideDisplay
            class="pointer-events-none"
            :slide="SLIDES[0]"
            :theme="variant"
            preview-mode="compact"
          />
        </SelectableCard>
      </div>
    </section>
  </div>
</template>
