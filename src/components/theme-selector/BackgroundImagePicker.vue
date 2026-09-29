<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import ContextMenu from "@/components/ui/ContextMenu.vue";
import ContextMenuItem from "@/components/ui/ContextMenuItem.vue";
import AddBackgroundImageModal from "@/modals/AddBackgroundImage/AddBackgroundImageModal.vue";
import { openModal } from "@/modals/openModal";
import Alert from "@/modals/Alert";
import { BackgroundRotationUtils } from "@/core/utils/BackgroundRotationUtils";
import BackgroundOpacitySlider from "./BackgroundOpacitySlider.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import ThemeItem from "./ThemeItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();

// Context menu shown at the right-click position (ContextMenu.vue
// portaled — same approach as React).
const menuOpen = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const targetId = ref<string | null>(null);

const currentBackground = computed(() => {
  const theme = editor.currentTheme;
  if (theme.backgroundId) {
    return editor.availableBackgrounds.find((bg) => bg.id === theme.backgroundId);
  }
  return editor.availableBackgrounds.find(
    (bg) => bg.backgroundImage === theme.backgroundUrl,
  );
});

const rotating = computed(() => editor.currentTheme.rotateBackgrounds ?? false);

function isSelected(id: string) {
  return rotating.value
    ? (editor.currentTheme.backgroundIds ?? []).includes(id)
    : currentBackground.value?.id === id;
}

function handleThemeClick(themeId: string) {
  const theme = editor.currentTheme;
  const background = editor.availableBackgrounds.find((bg) => bg.id === themeId);
  if (!background) return;

  if (rotating.value) {
    const ids = BackgroundRotationUtils.toggle(theme.backgroundIds ?? [], themeId);
    theme.backgroundIds = ids;
    const primary = editor.availableBackgrounds.find((bg) => bg.id === ids[0]);
    if (!primary) return;
    theme.backgroundId = primary.id;
    theme.backgroundUrl = primary.backgroundImage;
    return;
  }

  theme.backgroundId = background.id;
  theme.backgroundUrl = background.backgroundImage;
}

const isCustom = (id: string) => id.startsWith("custom-");

function handleContextMenu(event: MouseEvent, id: string) {
  if (!isCustom(id)) return;
  targetId.value = id;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  menuOpen.value = true;
}

async function handleDeleteClick() {
  const id = targetId.value;
  targetId.value = null;
  menuOpen.value = false;
  if (id) await confirmRemove(id);
}

async function confirmRemove(id: string) {
  const confirmed = await Alert.show({
    title: t("components.themeSelector.removeBackground"),
    message:
      t("components.themeSelector.removeBackgroundConfirm"),
    confirmText: t("common.actions.remove"),
    isDestructive: true,
  });

  if (confirmed) editor.removeCustomBackground(id);
}
</script>

<template>
  <div class="flex flex-col">
    <BackgroundOpacitySlider />

    <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      <ThemeItem
        v-for="background in editor.availableBackgrounds"
        :key="background.id"
        :background="background"
        :is-active="isSelected(background.id)"
        :removable="isCustom(background.id)"
        @select="handleThemeClick"
        @remove="confirmRemove"
        @context-menu="handleContextMenu"
      />

      <Button
        variant="text"
        severity="secondary"
        icon="pi pi-plus"
        :label="t('components.themeSelector.addImage')"
        class="group aspect-video h-auto w-full border-2 border-dashed border-border p-0 transition-all hover:bg-transparent hover:border-surface-light"
        @click="
          openModal(AddBackgroundImageModal, {
            onSaveBackground: editor.addCustomBackground,
          })
        "
      />
    </div>

    <ContextMenu v-model="menuOpen" :x="menuX" :y="menuY">
      <ContextMenuItem icon="app~alertTriangle" variant="danger" @click="handleDeleteClick">
        {{ t('components.themeSelector.removeBackground') }}
      </ContextMenuItem>
    </ContextMenu>
  </div>
</template>
