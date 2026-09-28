<script setup lang="ts">
import Button from "primevue/button";
import ColorField from "@/components/ui/ColorField.vue";
import { clampFontScale } from "@/core/state/theme/themeNormalization";
import FontFamilySelect from "./FontFamilySelect.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import { useTextStyle } from "./TextStyleContext";
import ThemeToolbarIconButton from "./ThemeToolbarIconButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();
const style = useTextStyle();

const adjustFontScale = (delta: number) => {
  style().fontScale = clampFontScale((style().fontScale ?? 1) + delta);
};

const toggleBold = () => (style().fontBold = !(style().fontBold ?? true));
const toggleItalic = () => (style().fontItalic = !(style().fontItalic ?? false));
const toggleUppercase = () =>
  (style().fontUppercase = !(style().fontUppercase ?? false));
</script>

<template>
  <div class="w-56">
    <FontFamilySelect
      :model-value="style().fontFamily ?? ''"
      :fallback-options="editor.fontOptions"
      @update:model-value="style().fontFamily = $event"
    />
  </div>

  <div class="flex items-center gap-0.5">
    <ThemeToolbarIconButton icon="app~textDecrease" :label="t('components.themeSelector.decreaseFont')" @click="adjustFontScale(-0.1)" />
    <span class="w-10 text-center text-xs tabular-nums text-surface-foreground">
      {{ Math.round((style().fontScale ?? 1) * 100) }}%
    </span>
    <ThemeToolbarIconButton icon="app~textIncrease" :label="t('components.themeSelector.increaseFont')" @click="adjustFontScale(0.1)" />

    <span aria-hidden="true" class="mx-1.5 h-5 w-px bg-border/80" />

    <ThemeToolbarIconButton icon="app~bold" :label="t('components.themeSelector.bold')" :active="style().fontBold ?? true" @click="toggleBold" />
    <ThemeToolbarIconButton icon="app~italic" :label="t('components.themeSelector.italic')" :active="style().fontItalic ?? false" @click="toggleItalic" />
    <ThemeToolbarIconButton icon="app~uppercase" :label="t('components.themeSelector.uppercase')" :active="style().fontUppercase ?? false" @click="toggleUppercase" />

    <span aria-hidden="true" class="mx-1.5 h-5 w-px bg-border/80" />

    <ColorField
      id="text-color"
      :label="t('components.themeSelector.color')"
      :model-value="style().textColor || '#ffffff'"
      @update:model-value="style().textColor = $event"
    />
    <Button
      v-if="style().textColor"
      variant="text"
      severity="secondary"
      size="small"
      icon="pi pi-times"
      :aria-label="t('components.themeSelector.useThemeColor')"
      :title="t('components.themeSelector.useThemeColor')"
      class="text-muted-foreground hover:text-surface-foreground"
      @click="style().textColor = ''"
    />
  </div>
</template>
