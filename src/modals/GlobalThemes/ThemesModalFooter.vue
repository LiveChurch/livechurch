<script setup lang="ts">
import Button from "primevue/button";
import { useGlobalThemesModalState } from "./useGlobalThemesModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { isDirty, save, discard } = useGlobalThemesModalState();
</script>

<template>
  <div class="flex w-full items-center justify-between gap-3">
    <p class="text-xs text-muted-foreground" role="status">
      <template v-if="isDirty">{{ t('modals.globalThemes.unsaved') }}</template>
    </p>

    <div class="flex justify-end gap-2">
      <Button
        variant="text"
        severity="secondary"
        class="bg-surface-light text-surface-foreground"
        :label="t('modals.globalThemes.discard')"
        type="button"
        :disabled="!isDirty"
        @click="discard"
      />
      <Button
        icon="pi pi-save"
        :label="t('common.actions.save')"
        type="button"
        :disabled="!isDirty"
        @click="save"
      />
    </div>
  </div>
</template>
