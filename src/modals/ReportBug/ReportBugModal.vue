<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import {
  BUG_REPORT_LIMITS,
  BugReportService,
  type BugReport,
} from "@/core/services/BugReportService";
import Modal from "../Modal.vue";
import BugImages from "./BugImages.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const form = reactive<BugReport>({
  title: "",
  description: "",
  steps: "",
  images: [],
});
const errorMessage = ref("");

const canSubmit = computed(
  () => form.title.trim() !== "" && form.description.trim() !== "",
);

const submit = async () => {
  if (!canSubmit.value) return;
  errorMessage.value = "";
  try {
    await BugReportService.send(form);
    close();
  } catch (error) {
    console.error("Falha ao enviar o relatório de bug", error);
    errorMessage.value = t("modals.reportBug.sendFailed");
  }
};
</script>

<template>
  <Modal ref="modalRef" :title="t('control.menu.reportBug')" class-name="max-w-xl">
    <div class="flex flex-col gap-4">
      <Input
        id="bug-title"
        v-model="form.title"
        :label="t('components.themeSelector.sections.title')"
        :placeholder="t('modals.reportBug.titleExample')"
        :maxlength="BUG_REPORT_LIMITS.title"
        autofocus
      />
      <Input
        id="bug-description"
        v-model="form.description"
        type="textarea"
        :label="t('modals.reportBug.whatHappened')"
        :placeholder="t('modals.reportBug.describe')"
        :maxlength="BUG_REPORT_LIMITS.description"
        :rows="4"
      />
      <Input
        id="bug-steps"
        v-model="form.steps"
        type="textarea"
        :label="t('modals.reportBug.steps')"
        :placeholder="t('modals.reportBug.stepsPlaceholder')"
        :maxlength="BUG_REPORT_LIMITS.steps"
        :rows="3"
      />
      <BugImages v-model="form.images" />
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-3">
        <p v-if="errorMessage" class="text-xs text-danger" role="alert">
          {{ errorMessage }}
        </p>
        <div class="ml-auto flex shrink-0 gap-3">
          <Button
            variant="text"
            severity="secondary"
            class="text-muted-foreground hover:text-surface-foreground"
            :label="t('common.actions.cancel')"
            @click="close()"
          />
          <Button
            class="bg-primary text-white hover:bg-primary-hover"
            icon="pi pi-send"
            :label="t('common.actions.send')"
            :disabled="!canSubmit"
            @click="submit"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>
