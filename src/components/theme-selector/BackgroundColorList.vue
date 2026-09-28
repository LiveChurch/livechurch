<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_GRADIENT,
} from "@/core/state/theme/themeNormalization";
import type { BackgroundFill } from "@/core/types/theme";
import { BackgroundRotationUtils } from "@/core/utils/BackgroundRotationUtils";
import BackgroundFillEditor from "./BackgroundFillEditor.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();

const fills = computed(() => BackgroundRotationUtils.fillsOf(editor.currentTheme));

/** Keeps `backgroundColor`/`backgroundGradient` (used outside the rotation) equal to the first color. */
function setFills(values: BackgroundFill[]) {
  const theme = editor.currentTheme;
  theme.backgroundColors = values;
  theme.backgroundColor = values[0].color;
  theme.backgroundGradient = values[0].gradient;
}

function setFill(index: number, value: BackgroundFill) {
  setFills(fills.value.map((fill, i) => (i === index ? value : fill)));
}

function addFill() {
  setFills([
    ...fills.value,
    { color: DEFAULT_BACKGROUND_COLOR, gradient: { ...DEFAULT_BACKGROUND_GRADIENT } },
  ]);
}

function removeFill(index: number) {
  setFills(fills.value.filter((_, i) => i !== index));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <BackgroundFillEditor
      v-for="(fill, index) in fills"
      :key="index"
      :id-prefix="`background-fill-${index}`"
      :model-value="fill"
      @update:model-value="setFill(index, $event)"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold text-surface-foreground">Fundo {{ index + 1 }}</h4>
          <Button
            v-if="fills.length > 1"
            variant="text"
            severity="secondary"
            icon="pi pi-trash"
            :aria-label="`Remover fundo ${index + 1}`"
            @click="removeFill(index)"
          />
        </div>
      </template>
    </BackgroundFillEditor>

    <Button
      variant="text"
      severity="secondary"
      icon="pi pi-plus"
      :label="t('components.themeSelector.addColor')"
      class="self-start"
      @click="addFill"
    />
  </div>
</template>
