<script setup lang="ts">
import type { TextAlign, TextAnchor } from "@/core/types/theme";
import { useTextStyle } from "./TextStyleContext";
import ThemeToolbarIconButton from "./ThemeToolbarIconButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

withDefaults(defineProps<{ showAnchor?: boolean }>(), { showAnchor: true });

const style = useTextStyle();

const HORIZONTAL_ALIGN_OPTIONS: { id: TextAlign; icon: string; label: string }[] = [
  { id: "left", icon: "app~textAlignLeft", label: t("components.themeSelector.alignLeft") },
  { id: "center", icon: "app~textAlignCenter", label: t("components.themeSelector.alignCenter") },
  { id: "right", icon: "app~textAlignRight", label: t("components.themeSelector.alignRight") },
  { id: "justify", icon: "app~textAlignJustify", label: t("components.themeSelector.justify") },
];

const VERTICAL_ANCHOR_OPTIONS: { id: TextAnchor; icon: string; label: string }[] = [
  { id: "top", icon: "app~alignTop", label: t("components.themeSelector.anchorTop") },
  { id: "center", icon: "app~alignCenter", label: t("components.themeSelector.anchorCenter") },
  { id: "bottom", icon: "app~alignBottom", label: t("components.themeSelector.anchorBottom") },
];
</script>

<template>
  <div class="flex items-center gap-0.5">
    <ThemeToolbarIconButton
      v-for="option in HORIZONTAL_ALIGN_OPTIONS"
      :key="option.id"
      :icon="option.icon"
      :label="option.label"
      :active="(style().textAlign ?? 'center') === option.id"
      @click="style().textAlign = option.id"
    />
  </div>
  <div v-if="showAnchor" class="flex items-center gap-0.5">
    <ThemeToolbarIconButton
      v-for="option in VERTICAL_ANCHOR_OPTIONS"
      :key="option.id"
      :icon="option.icon"
      :label="option.label"
      :active="(style().textAnchor ?? 'center') === option.id"
      @click="style().textAnchor = option.id"
    />
  </div>
</template>
