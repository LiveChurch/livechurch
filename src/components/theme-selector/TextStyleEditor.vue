<script setup lang="ts">
import { ref } from "vue";
import RibbonGroup from "./RibbonGroup.vue";
import SubsectionTabs from "./SubsectionTabs.vue";
import TextBackgroundSection from "./TextBackgroundSection.vue";
import TextEffectSection from "./TextEffectSection.vue";
import TextFontGroup from "./TextFontGroup.vue";
import TextOutlineSection from "./TextOutlineSection.vue";
import TextParagraphGroup from "./TextParagraphGroup.vue";
import TextSpacingGroup from "./TextSpacingGroup.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Text style editor (font, paragraph, outline, shadow and box).
 * Changes the object provided by `provideTextStyle`, so it serves both the text and the title.
 */
withDefaults(defineProps<{ showAnchor?: boolean }>(), { showAnchor: true });

const TABS = [
  { id: "font", label: t("components.themeSelector.fontAndParagraph") },
  { id: "outline", label: t("components.themeSelector.outline") },
  { id: "shadow", label: t("components.themeSelector.shadow") },
  { id: "box", label: t("components.themeSelector.textBox") },
] as const;

const active = ref<(typeof TABS)[number]["id"]>("font");
</script>

<template>
  <div class="flex flex-col">
    <SubsectionTabs v-model="active" :tabs="TABS" />

    <div class="m-4 flex flex-wrap overflow-hidden rounded-lg border border-border/60 bg-surface-light/20">
      <template v-if="active === 'font'">
        <RibbonGroup :caption="t('components.themeSelector.font')"><TextFontGroup /></RibbonGroup>
        <RibbonGroup :caption="t('components.themeSelector.paragraph')"><TextParagraphGroup :show-anchor="showAnchor" /></RibbonGroup>
        <RibbonGroup :caption="t('components.themeSelector.spacing')"><TextSpacingGroup /></RibbonGroup>
      </template>
      <RibbonGroup v-else-if="active === 'outline'" :caption="t('components.themeSelector.outline')"><TextOutlineSection /></RibbonGroup>
      <RibbonGroup v-else-if="active === 'shadow'" :caption="t('components.themeSelector.shadow')"><TextEffectSection /></RibbonGroup>
      <RibbonGroup v-else :caption="t('components.themeSelector.textBox')"><TextBackgroundSection /></RibbonGroup>
    </div>
  </div>
</template>
