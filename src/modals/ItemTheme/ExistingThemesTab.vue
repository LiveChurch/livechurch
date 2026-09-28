<script setup lang="ts">
import { computed } from "vue";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import SelectableCard from "@/components/ui/SelectableCard.vue";
import type { Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Grid of global themes available for the item's category. */
defineProps<{
  themes: SlidesTheme[];
  selectedThemeId: string | null;
}>();

const emit = defineEmits<{ select: [themeId: string] }>();

const SAMPLE_SLIDE = computed<Slide>(() => ({ title: "", text: t("common.terms.sampleText") }));
</script>

<template>
  <div class="custom-scrollbar h-full overflow-y-auto p-4">
    <div class="grid grid-cols-3 gap-x-3 gap-y-4">
      <SelectableCard
        v-for="theme in themes"
        :key="theme.id"
        :label="theme.name || 'Tema sem nome'"
        :selected="selectedThemeId === theme.id"
        @select="emit('select', theme.id)"
      >
        <SlideDisplay
          class="pointer-events-none"
          :slide="SAMPLE_SLIDE"
          :theme="theme"
          preview-mode="compact"
        />
      </SelectableCard>
    </div>
  </div>
</template>
