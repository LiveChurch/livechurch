<script setup lang="ts">
import Button from "primevue/button";
import ColorField from "@/components/ui/ColorField.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();

function setColor(color: string) {
  editor.currentTheme.textColor = color;
}

function resetColor() {
  editor.currentTheme.textColor = "";
}
</script>

<template>
  <div class="flex flex-col items-start gap-3 p-4">
    <ColorField
      id="text-color"
      :label="t('components.themeSelector.textColor')"
      :model-value="editor.currentTheme.textColor || '#ffffff'"
      @update:model-value="setColor"
    />
    <Button
      v-if="editor.currentTheme.textColor"
      variant="text"
      severity="secondary"
      :label="t('components.themeSelector.useThemeColor')"
      class="p-0 text-xs text-muted-foreground hover:text-surface-foreground"
      @click="resetColor"
    />
  </div>
</template>
