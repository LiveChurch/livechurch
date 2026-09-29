<script setup lang="ts">
import { computed } from "vue";
import BackgroundColorPicker from "./BackgroundColorPicker.vue";
import BackgroundImagePicker from "./BackgroundImagePicker.vue";
import SubsectionTabs from "./SubsectionTabs.vue";
import { BACKGROUND_VARIANTS, BackgroundVariants, type BackgroundVariantId } from "./backgroundModes";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();

const variant = computed<BackgroundVariantId>({
  get: () => BackgroundVariants.of(editor.currentTheme),
  set: (id) => BackgroundVariants.apply(editor.currentTheme, id),
});

const mode = computed(() => editor.currentTheme.backgroundMode ?? "image");
</script>

<template>
  <div class="flex flex-col">
    <SubsectionTabs v-model="variant" :tabs="BACKGROUND_VARIANTS" />
    <div class="p-4">
      <p v-if="mode === 'none'" class="text-sm text-muted-foreground">
        {{ t('components.themeSelector.noBackgroundHint') }}
      </p>
      <BackgroundImagePicker v-else-if="mode === 'image'" />
      <BackgroundColorPicker v-else />
    </div>
  </div>
</template>
