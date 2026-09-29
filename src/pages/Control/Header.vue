<script setup lang="ts">
/**
 * Header with logo, central search and theme toggle
 * (port of `src/pages/Control/Header.tsx`).
 */
import { computed } from "vue";
import Button from "primevue/button";
import { useThemeStore } from "@/core/state/theme/themeStore";
import SearchBar from "./SearchBar/SearchBar.vue";
import UpdateButton from "./UpdateButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const themeCtx = useThemeStore();

const themeLabel = computed(() =>
  themeCtx.state.uiTheme === "dark"
    ? t("control.header.useLightTheme")
    : t("control.header.useDarkTheme"),
);
</script>

<template>
  <header
    class="relative z-50 flex h-16 w-full shrink-0 select-none items-center justify-between border-b border-border/60 bg-surface px-4 backdrop-blur-md"
  >
    <!-- dynamic :src preserves React's runtime behavior (asset from /public,
         not a bundler import relative to the SFC). -->
    <img
      :src="'./logo.png'"
      :alt="t('control.header.logoAlt')"
      class="h-10 shrink-0 object-cover"
      draggable="false"
    />

    <div class="absolute left-1/2 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2">
      <SearchBar />
    </div>

    <div class="absolute right-4 flex items-center gap-2">
      <UpdateButton />
      <Button
        type="button"
        variant="text"
        severity="secondary"
        :title="themeLabel"
        :aria-label="themeLabel"
        :icon="themeCtx.state.uiTheme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
        class="h-9 w-9 rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface-light/40 hover:text-surface-foreground"
        @click="themeCtx.actions.toggleUiTheme"
      />
    </div>
  </header>
</template>
