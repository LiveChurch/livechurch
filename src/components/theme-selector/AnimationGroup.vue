<script setup lang="ts">
import EffectsSection from "./EffectsSection.vue";
import ThemeBlock from "./ThemeBlock.vue";
import TransitionSection from "./TransitionSection.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col">
    <ThemeBlock :title="t('components.themeSelector.slideTransition')"><TransitionSection /></ThemeBlock>
    <ThemeBlock :title="t('components.themeSelector.ambientEffect')"><EffectsSection /></ThemeBlock>
  </div>
</template>
