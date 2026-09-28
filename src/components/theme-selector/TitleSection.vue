<script setup lang="ts">
import { watch } from "vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import { DEFAULT_TITLE_STYLE } from "@/core/state/theme/themeNormalization";
import TextStyleEditor from "./TextStyleEditor.vue";
import { provideTextStyle } from "./TextStyleContext";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Title tab: turns the title on/off and edits the style with the same editor as the text. */
const editor = useThemeEditor();

// Ensures the theme has its own `titleStyle`, so edits do not change the shared default.
watch(
  () => editor.currentTheme,
  (theme) => {
    theme.titleStyle ??= { ...DEFAULT_TITLE_STYLE };
  },
  { immediate: true },
);

const title = () => editor.currentTheme.titleStyle ?? DEFAULT_TITLE_STYLE;
provideTextStyle(title);
</script>

<template>
  <div class="flex flex-col gap-2 pt-4">
    <div class="px-4">
      <ToggleSwitch
        :label="t('components.themeSelector.showSlideTitle')"
        :model-value="title().visible"
        @update:model-value="title().visible = $event"
      />
    </div>
    <TextStyleEditor v-if="title().visible" :show-anchor="false" />
  </div>
</template>
