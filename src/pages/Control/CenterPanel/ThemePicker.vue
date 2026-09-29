<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import SelectableCard from "@/components/ui/SelectableCard.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import type { Slide } from "@/core/types/playlist";
import type { ThemeBinding } from "@/core/types/theme";
import ItemThemeModal from "@/modals/ItemTheme/ItemThemeModal.vue";
import { openModal } from "@/modals/openModal";
import { useThemePicker } from "./useThemePicker";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const SAMPLE_SLIDE = computed<Slide>(() => ({ title: "", text: t("common.terms.sampleText") }));

const {
  disabled,
  category,
  currentBinding,
  themes,
  selectedThemeId,
  isRandomSelected,
  isCustomSelected,
  personalTheme,
  personalThemeBase,
  selectTheme,
  selectPersonalTheme,
  selectRandom,
  applyBinding,
} = useThemePicker();

/** Opens the item's custom theme editor, straight on the "Custom theme" tab. */
const openCustomEditor = () => {
  openModal(ItemThemeModal, {
    category: category.value,
    currentTheme: personalThemeBase.value,
    currentBinding: currentBinding.value,
    initialTab: "create",
    onApply: (binding: ThemeBinding) => applyBinding(binding),
  });
};

/**
 * Click on the custom theme card: if a saved one already exists and is not
 * active, it just reapplies it (quick switch); otherwise it opens the editor (to create the
 * first one, or edit the one already active).
 */
const handlePersonalThemeClick = () => {
  if (personalTheme.value && !isCustomSelected.value) {
    selectPersonalTheme();
  } else {
    openCustomEditor();
  }
};
</script>

<template>
  <div
    class="custom-scrollbar min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-surface p-4"
  >
    <div class="grid grid-cols-2 gap-x-3 gap-y-4">
      <SelectableCard
        :selected="isRandomSelected"
        :disabled="disabled"
        @select="selectRandom"
      >
        <span class="text-sm font-semibold text-white">{{ t('control.centerPanel.random') }}</span>
      </SelectableCard>

      <!-- Fixed slot for the item's custom theme: always present and never
           reset when switching to a global theme, so the way
           back to it is never "lost". -->
      <SelectableCard
        :label="t('control.centerPanel.customTheme')"
        :selected="isCustomSelected"
        :disabled="disabled"
        @select="handlePersonalThemeClick"
      >
        <template v-if="personalTheme">
          <SlideDisplay
            class="pointer-events-none"
            :slide="SAMPLE_SLIDE"
            :theme="personalTheme"
            preview-mode="compact"
          />
          <Button
            type="button"
            variant="text"
            severity="secondary"
            icon="pi pi-pencil"
            :aria-label="t('control.centerPanel.editCustomTheme')"
            class="absolute right-2 top-2 z-20 rounded bg-surface p-1 text-inherit opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            @click.stop="openCustomEditor"
          />
        </template>
        <div v-else class="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
          <AppIcon name="app~palette" size="20px" />
        </div>
      </SelectableCard>

      <div class="col-span-2 mt-1 flex items-center gap-2">
        <span class="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          {{ t('control.centerPanel.globalThemes') }}
        </span>
        <div class="h-px flex-1 bg-border" />
      </div>

      <SelectableCard
        v-for="theme in themes"
        :key="theme.id"
        :label="theme.name || t('common.terms.unnamedTheme')"
        :selected="selectedThemeId === theme.id"
        :disabled="disabled"
        @select="selectTheme(theme.id)"
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
