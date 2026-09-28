<script setup lang="ts">
import ThemeEditor from "@/components/theme-selector/ThemeEditor.vue";
import ThemeDetailsFields from "./ThemeDetailsFields.vue";
import { useGlobalThemesModalState } from "./useGlobalThemesModal";

/** Edit panel of the selected theme (draft of the Global Themes modal). */
const { themeDraft } = useGlobalThemesModalState();
</script>

<template>
  <div v-if="themeDraft" class="flex h-full min-w-0 flex-1">
    <ThemeEditor :theme="themeDraft">
      <template #details>
        <ThemeDetailsFields :theme="themeDraft" />
      </template>
    </ThemeEditor>
  </div>
</template>
