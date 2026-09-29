<script setup lang="ts">
import { ref } from "vue";
import Modal from "../Modal.vue";
import Sidebar from "./Sidebar.vue";
import ThemeDefaultsPanel from "./ThemeDefaultsPanel.vue";
import ThemeEditPanel from "./ThemeEditPanel.vue";
import ThemesModalFooter from "./ThemesModalFooter.vue";
import { createGlobalThemesModalState } from "./useGlobalThemesModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/globalThemes/GlobalThemesModal.tsx (modal aberto via openModal()). */
const modalRef = ref<InstanceType<typeof Modal> | null>(null);

const localState = createGlobalThemesModalState();
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('modals.globalThemes.title')"
    class-name="h-[94vh] max-h-[94vh] max-w-[96vw]"
    content-class-name="p-0"
  >
    <div class="flex h-full w-full min-h-0">
      <Sidebar />
      <ThemeDefaultsPanel v-if="localState.activePanel.value === 'defaults'" />
      <ThemeEditPanel v-else />
    </div>

    <template #footer>
      <ThemesModalFooter />
    </template>
  </Modal>
</template>
