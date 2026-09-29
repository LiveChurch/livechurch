<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Modal from "../Modal.vue";
import type { RecurringDeleteChoice } from "./RecurringDeleteAlert";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Scope choice when deleting a recurring event (this occurrence, future ones or all). */
const props = defineProps<{
  eventTitle: string;
  onChoose?: (choice: RecurringDeleteChoice) => void;
}>();

const OPTIONS: { choice: RecurringDeleteChoice; label: string; description: string }[] = [
  {
    choice: "instance",
    label: t("modals.calendar.onlyThisDay"),
    description: t("modals.calendar.onlyThisDayHint"),
  },
  {
    choice: "future",
    label: t("modals.calendar.thisAndNext"),
    description: t("modals.calendar.thisAndNextHint"),
  },
  {
    choice: "all",
    label: t("modals.calendar.allDays"),
    description: t("modals.calendar.allDaysHint"),
  },
];

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const choose = (choice: RecurringDeleteChoice) => {
  props.onChoose?.(choice);
  close();
};
</script>

<template>
  <Modal ref="modalRef" :title="t('modals.calendar.deleteRecurringTitle')" class-name="max-w-md">
    <p class="mb-4 text-muted-foreground">
      {{ t('modals.calendar.recurringQuestion', { title: props.eventTitle }) }}
    </p>

    <div class="flex flex-col gap-2">
      <button
        v-for="option in OPTIONS"
        :key="option.choice"
        type="button"
        class="rounded-lg border border-border px-4 py-3 text-left transition-colors hover:border-danger hover:bg-danger/5"
        @click="choose(option.choice)"
      >
        <div class="font-medium text-surface-foreground">{{ option.label }}</div>
        <div class="text-sm text-muted-foreground">{{ option.description }}</div>
      </button>
    </div>

    <template #footer>
      <div class="flex w-full justify-end">
        <Button
          variant="text"
          severity="secondary"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
      </div>
    </template>
  </Modal>
</template>
