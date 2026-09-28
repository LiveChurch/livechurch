<script setup lang="ts">
import TextStyleEditor from "./TextStyleEditor.vue";
import { provideTextStyle } from "./TextStyleContext";
import { useThemeEditor } from "./ThemeEditorContext";

const editor = useThemeEditor();
provideTextStyle(() => editor.currentTheme);
</script>

<template>
  <TextStyleEditor />
</template>
