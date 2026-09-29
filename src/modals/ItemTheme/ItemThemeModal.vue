<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import ContextMenu from "@/components/ui/ContextMenu.vue";
import ContextMenuItem from "@/components/ui/ContextMenuItem.vue";
import Tabs from "@/components/ui/Tabs.vue";
import type { DefaultThemeCategory, SlidesTheme, ThemeBinding } from "@/core/types/theme";
import Modal from "../Modal.vue";
import CreateThemeTab from "./CreateThemeTab.vue";
import ExistingThemesTab from "./ExistingThemesTab.vue";
import { useItemThemeModal, type ItemThemeModalTab } from "./useItemThemeModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Generic modal for a playlist item's theme (opened via `openModal()`):
 * choose an already existing global theme or create an item-exclusive theme.
 * Does not depend on the item type — reusable by any form.
 */
const props = defineProps<{
  /** Item's theme category (filters the "Select existing theme" tab). */
  category?: DefaultThemeCategory;
  /** Currently applied theme, used as the base of the "Custom theme" tab's draft. */
  currentTheme: SlidesTheme;
  currentBinding?: ThemeBinding | null;
  /** Forces the initial tab (e.g. open straight on "Custom theme"). */
  initialTab?: ItemThemeModalTab;
}>();

const emit = defineEmits<{ apply: [binding: ThemeBinding] }>();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const {
  activeTab,
  existingThemes,
  selectedThemeId,
  draft,
  buildCustomBinding,
  globalThemeOptions,
  copyFromGlobalTheme,
  promoteDraftToGlobalTheme,
} = useItemThemeModal(props);

const TABS: { id: ItemThemeModalTab; label: string; icon: string }[] = [
  { id: "existing", label: t("modals.itemTheme.selectExisting"), icon: "grid_view" },
  { id: "create", label: t("control.centerPanel.customTheme"), icon: "app~palette" },
];

const menuOpen = ref(false);
const menuX = ref(0);
const menuY = ref(0);

const openMenu = (event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  menuX.value = rect.left;
  menuY.value = rect.top - 4;
  menuOpen.value = true;
};

const copyGlobalTheme = (themeId: string) => {
  menuOpen.value = false;
  copyFromGlobalTheme(themeId);
};

const promoteToGlobal = () => {
  menuOpen.value = false;
  promoteDraftToGlobalTheme();
};

const selectExisting = (themeId: string) => {
  emit("apply", { mode: "global", themeId });
  close();
};

const useCustomTheme = () => {
  emit("apply", buildCustomBinding());
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('components.itemTheme.theme')"
    class-name="h-170 max-w-6xl"
    content-class-name="flex flex-col overflow-hidden p-0"
  >
    <div class="flex h-full min-h-0 w-full flex-col">
      <Tabs v-model="activeTab" :tabs="TABS" />

      <div class="min-h-0 flex-1">
        <ExistingThemesTab
          v-if="activeTab === 'existing'"
          :themes="existingThemes"
          :selected-theme-id="selectedThemeId"
          @select="selectExisting"
        />
        <CreateThemeTab v-else :draft="draft" />
      </div>

      <div class="flex items-center justify-end gap-3 border-t border-border/60 p-4">
        <Button
          v-if="activeTab === 'create'"
          variant="text"
          severity="secondary"
          class="mr-auto text-muted-foreground hover:text-surface-foreground"
          icon="pi pi-ellipsis-h"
          :label="t('modals.itemTheme.moreOptions')"
          @click="openMenu"
        />
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          v-if="activeTab === 'create'"
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('modals.itemTheme.useTheme')"
          @click="useCustomTheme()"
        />
      </div>
    </div>

    <ContextMenu v-model="menuOpen" :x="menuX" :y="menuY">
      <ContextMenuItem @click="promoteToGlobal">
        {{ t('modals.itemTheme.saveAsGlobal') }}
      </ContextMenuItem>
      <p class="px-3 pb-1 pt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        {{ t('modals.itemTheme.copyFromGlobal') }}
      </p>
      <ContextMenuItem
        v-for="option in globalThemeOptions"
        :key="option.value"
        @click="copyGlobalTheme(option.value)"
      >
        {{ option.label }}
      </ContextMenuItem>
    </ContextMenu>
  </Modal>
</template>
