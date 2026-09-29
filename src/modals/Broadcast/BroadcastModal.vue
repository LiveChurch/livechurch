<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import Tabs from "@/components/ui/Tabs.vue";
import { useBroadcastStore } from "@/core/state/broadcast/broadcastStore";
import type { BroadcastMode } from "@/core/types/broadcast";
import Modal from "../Modal.vue";
import BroadcastPreview from "./BroadcastPreview.vue";
import BroadcastStyleFields from "./BroadcastStyleFields.vue";
import BroadcastTextStyleFields from "./BroadcastTextStyleFields.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Broadcast output: each click opens one more window for OBS, in the mode of the chosen tab. */
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const { actions } = useBroadcastStore();

const MODE_TABS: { id: BroadcastMode; label: string; icon: string }[] = [
  { id: "caption", label: t("modals.broadcast.captionOnly"), icon: "subtitles" },
  { id: "live", label: t("modals.broadcast.liveOutput"), icon: "live_tv" },
];

const mode = ref<BroadcastMode>("caption");
const isCaption = computed(() => mode.value === "caption");

const opening = ref(false);
const openError = ref<string | null>(null);

const openWindow = async () => {
  opening.value = true;
  openError.value = null;
  try {
    await actions.openWindow(mode.value);
    modalRef.value?.hide();
  } catch (error) {
    console.error("Falha ao abrir a janela de transmissão", error);
    openError.value = t("modals.broadcast.openFailed");
  } finally {
    opening.value = false;
  }
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('modals.broadcast.title')"
    class-name="max-w-4xl"
    content-class-name="flex flex-col p-0"
  >
    <Tabs v-model="mode" :tabs="MODE_TABS" />

    <div class="flex gap-6 p-6">
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <template v-if="isCaption">
          <BroadcastStyleFields />
          <BroadcastTextStyleFields />
          <p class="text-xs text-muted-foreground">
            {{ t('modals.broadcast.themeFollows') }}
          </p>
        </template>
        <p v-else class="text-sm text-muted-foreground">
          {{ t('modals.broadcast.liveDescription') }}
        </p>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-3 border-l border-border/60 pl-6">
        <BroadcastPreview :mode="mode" />
        <ol class="flex list-decimal flex-col gap-1 pl-4 text-sm text-muted-foreground">
          <li>{{ t('modals.broadcast.stepOpen') }}</li>
          <li>{{ t('modals.broadcast.stepObs') }}</li>
          <li v-if="isCaption">
            {{ t('modals.broadcast.stepChroma') }}
          </li>
        </ol>
        <p v-if="openError" class="text-sm text-danger">{{ openError }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex w-full items-center gap-3">
        <Button
          v-if="isCaption"
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('modals.broadcast.restoreDefaults')"
          icon="pi pi-refresh"
          @click="actions.resetStyle"
        />
        <Button
          variant="text"
          severity="secondary"
          class="ml-auto text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.close')"
          @click="modalRef?.hide()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('modals.broadcast.openWindow')"
          icon="pi pi-video"
          :loading="opening"
          @click="openWindow"
        />
      </div>
    </template>
  </Modal>
</template>
