<script setup lang="ts">
import { computed } from "vue";
import type { BackgroundFill } from "@/core/types/theme";
import { BackgroundFillUtils } from "@/core/utils/BackgroundFillUtils";
import BackgroundColorList from "./BackgroundColorList.vue";
import BackgroundFillEditor from "./BackgroundFillEditor.vue";
import { useThemeEditor } from "./ThemeEditorContext";

const editor = useThemeEditor();

const rotating = computed(() => editor.currentTheme.rotateBackgrounds ?? false);
const fill = computed(() => BackgroundFillUtils.fillOf(editor.currentTheme));

function setFill(value: BackgroundFill) {
  editor.currentTheme.backgroundColor = value.color;
  editor.currentTheme.backgroundGradient = value.gradient;
}
</script>

<template>
  <BackgroundColorList v-if="rotating" />
  <BackgroundFillEditor
    v-else
    id-prefix="background"
    :model-value="fill"
    @update:model-value="setFill"
  />
</template>
