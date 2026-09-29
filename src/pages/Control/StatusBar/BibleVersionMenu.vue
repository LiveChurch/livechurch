<script setup lang="ts">
/**
 * Bible version selection menu (port of
 * `src/pages/Control/StatusBar/BibleVersionMenu.tsx`).
 */
import { computed, ref } from "vue";
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useClickOutside } from "@/core/composables/useClickOutside";
import { useI18n } from "vue-i18n";
import Alert from "@/modals/Alert";
import { BibleVersions } from "@/core/data/bibleVersions";
import type { BibleVersion } from "@/core/types/playlist";
import BibleImportFooter from "./BibleImportFooter.vue";
import BibleVersionItem from "./BibleVersionItem.vue";
import { useLanguageStore } from "@/core/state/language/languageStore";

const { t } = useI18n();
const languageState = useLanguageStore().state;

const playlistCtx = usePlaylistStore();
const state = playlistCtx.state;
const actions = playlistCtx.actions;

const menuRef = ref<HTMLElement | null>(null);
const open = ref(false);

useClickOutside(menuRef, () => (open.value = false), open);

const activeVersion = computed(
  () => state.activeBibleVersion ?? state.bibleVersions[0],
);

// Only the versions of the interface language.
const localeVersions = computed(() =>
  state.bibleVersions.filter((version) => version.locale === languageState.locale),
);

const handleRemove = async (version: BibleVersion) => {
  const confirmed = await Alert.show({
    title: t("control.statusBar.removeBible"),
    message: t("control.statusBar.removeBibleMessage", { name: version.name }),
    isDestructive: true,
  });
  if (!confirmed) return;
  if (state.bibleVersionId === version.id) {
    const fallback = BibleVersions.defaultFor(languageState.locale);
    if (fallback) actions.setBibleVersion(fallback.id);
  }
  await BibleVersions.removeCustom(version.id);
};

const handleSelect = (versionId: string) => {
  actions.setBibleVersion(versionId);
  open.value = false;
};
</script>

<template>
  <div ref="menuRef" class="relative z-80">
    <Button
      type="button"
      variant="text"
      severity="secondary"
      aria-haspopup="menu"
      :aria-expanded="open"
      class="rounded-md border border-border px-3 py-1.5 text-xs tracking-wide text-surface-foreground hover:bg-surface-light/60"
      @click="open = !open"
    >
      {{ activeVersion.name }}
    </Button>

    <div
      v-if="open"
      class="absolute bottom-11 right-0 z-90 w-[350px] rounded-xl border border-border bg-surface p-3 text-xs text-surface-foreground/80 shadow-2xl backdrop-blur-xl"
    >
      <div class="flex items-center justify-between border-b border-border pb-3">
        <div>
          <p class="text-xs font-bold uppercase">{{ t('control.statusBar.bibles') }}</p>
          <p class="text-xs text-muted-foreground">
            {{ t('control.statusBar.chooseVersion') }}
          </p>
        </div>
        <span class="text-xs text-muted-foreground">{{ activeVersion.tag }}</span>
      </div>

      <div class="mt-2 flex flex-col gap-1.5" role="menu">
        <BibleVersionItem
          v-for="version in localeVersions"
          :key="version.id"
          :version="version"
          :active="version.id === activeVersion?.id"
          @select="handleSelect(version.id)"
          @remove="handleRemove(version)"
        />
      </div>

      <BibleImportFooter @import="open = false" />
    </div>
  </div>
</template>
