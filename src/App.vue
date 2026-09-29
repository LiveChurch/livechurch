<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { desktop } from "@/core/services/DesktopService";
import { BroadcastWindowUtils } from "@/core/utils/BroadcastWindowUtils";
import ControlWindow from "@/pages/Control/ControlWindow.vue";
import ProjectorPage from "@/pages/Projector/ProjectorPage.vue";
import MonitorIdentifyPage from "@/pages/MonitorIdentify/MonitorIdentifyPage.vue";
import BroadcastPage from "@/pages/Broadcast/BroadcastPage.vue";
import ModalHost from "@/modals/ModalHost.vue";
import UndoToast from "@/components/ui/UndoToast.vue";
import LanguageSetupModal from "@/modals/LanguageSetup/LanguageSetupModal.vue";
import { openModal } from "@/modals/openModal";
import { useLanguageStore } from "@/core/state/language/languageStore";

// Replaces React's WindowRouter: page choice by the Electron window label.
const label = ref<string | null>(null);
const broadcastWindow = computed(() =>
  label.value ? BroadcastWindowUtils.parse(label.value) : null,
);

const language = useLanguageStore();

/** First run: asks the language; the modal can only be closed by choosing one. */
function askLanguageOnFirstRun() {
  if (!language.actions.needsSetup()) return;
  openModal(LanguageSetupModal);
}

// The label falls back to "main" when the window-label handler is not ready yet, so watch it instead of the IPC result.
watch(label, (current) => {
  if (current === "main") askLanguageOnFirstRun();
});

onMounted(() => {
  desktop
    .getCurrentWindowLabel()
    .then((current) => {
      label.value = current;
      if (current === "main") {
        setTimeout(() => void desktop.closeSplashscreen(), 500);
      }
    })
    .catch((error) => {
      console.error("Falha ao detectar a janela atual", error);
      label.value = "main";
    });
});
</script>

<template>
  <ProjectorPage v-if="label === 'projector'" />
  <BroadcastPage v-else-if="broadcastWindow" :mode="broadcastWindow.mode" />
  <MonitorIdentifyPage
    v-else-if="label && label.startsWith('monitor-identify-')"
    :window-label="label"
  />
  <template v-else-if="label === 'main'">
    <ControlWindow />
    <ModalHost />
    <UndoToast />
  </template>
</template>
