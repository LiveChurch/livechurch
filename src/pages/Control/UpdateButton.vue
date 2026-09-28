<script setup lang="ts">
/**
 * Update notice shown next to the theme toggle. Only appears when the update
 * server reports a version newer than the installed one.
 */
import { computed } from "vue";
import Button from "primevue/button";
import { useUpdateStore } from "@/core/state/update/updateStore";
import Alert from "@/modals/Alert";
import { UpdateButtonStates } from "./updateButtonView";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const updateCtx = useUpdateStore();
const view = computed(() => UpdateButtonStates.of(updateCtx.state));

const restartMessage = () =>
  updateCtx.state.type === "full"
    ? t("control.update.restartFull")
    : t("control.update.restartCode");

async function confirmAndApply() {
  const confirmed = await Alert.show({
    title: t("control.update.applyTitle"),
    message: restartMessage(),
    confirmText: t("control.update.applyNow"),
  });
  if (confirmed) await updateCtx.actions.apply();
}

async function handleClick() {
  try {
    if (updateCtx.state.status === "ready") await confirmAndApply();
    else await updateCtx.actions.download();
  } catch (error) {
    console.error("Falha ao atualizar", error);
    await Alert.show({
      title: t("control.update.failedTitle"),
      message: error instanceof Error ? error.message : t("control.update.tryAgain"),
      confirmText: t("common.actions.ok"),
    });
  }
}
</script>

<template>
  <Button
    v-if="view"
    type="button"
    variant="text"
    severity="secondary"
    size="small"
    :label="view.label"
    :title="view.title"
    :aria-label="view.title"
    :icon="view.icon"
    :disabled="view.disabled"
    class="text-brand hover:bg-surface-light/40"
    @click="handleClick"
  />
</template>
