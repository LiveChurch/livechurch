<script setup lang="ts">
import { ref } from "vue";
import { APP_LINKS } from "@/core/constants/appLinks";
import { desktop } from "@/core/services/DesktopService";
import Modal from "../Modal.vue";
import ReportBugModal from "../ReportBug/ReportBugModal.vue";
import { openModal } from "../openModal";
import SupportOption from "./SupportOption.vue";
import SystemInfoPanel from "./SystemInfoPanel.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const openKnownIssues = () => {
  desktop
    .openExternal(APP_LINKS.support)
    .catch((error) => console.error("Falha ao abrir o link de suporte", error));
};

const reportBug = () => {
  close();
  openModal(ReportBugModal);
};
</script>

<template>
  <Modal ref="modalRef" :title="t('control.menu.support')" class-name="max-w-lg">
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-2">
        <SupportOption
          icon="pi-comments"
          :title="t('modals.support.knownIssues')"
          :description="t('modals.support.knownIssuesHint')"
          @click="openKnownIssues"
        />
        <SupportOption
          icon="pi-flag"
          :title="t('modals.support.reportBug')"
          :description="t('modals.support.reportBugHint')"
          @click="reportBug"
        />
      </div>

      <SystemInfoPanel />
    </div>
  </Modal>
</template>
