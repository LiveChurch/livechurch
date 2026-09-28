<script setup lang="ts">
import type { SlidesTheme } from "@/core/types/theme";
import ResizablePanel from "@/components/shared/ResizablePanel.vue";
import ThemeSectionContent from "@/components/theme-selector/ThemeSectionContent.vue";
import type { ThemePanelSection } from "@/components/theme-selector/sections";

defineProps<{
  section: ThemePanelSection;
  currentTheme: SlidesTheme;
}>();
</script>

<template>
  <div class="absolute inset-x-0 bottom-[58px] z-50">
    <ResizablePanel
      direction="vertical"
      position="top"
      :min-size="200"
      :max-size="800"
      :default-size="256"
      :storage-key="`themePanelHeight:${section}`"
      class-name="flex min-h-0 flex-col overflow-hidden border-t border-border/60 bg-surface/60"
    >
      <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10">
        <ThemeSectionContent :section="section" :current-theme="currentTheme" />
      </div>
    </ResizablePanel>
  </div>
</template>
