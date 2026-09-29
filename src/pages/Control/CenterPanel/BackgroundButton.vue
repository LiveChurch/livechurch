<script setup lang="ts">
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Sets (or undoes) the previewed media as the standby screen, shown when nothing is on air. */
const { state, actions } = usePlaylistStore();
</script>

<template>
  <Button
    type="button"
    outlined
    size="small"
    severity="secondary"
    :label="state.isPreviewBackground ? t('control.centerPanel.removeStandby') : t('common.terms.setStandby')"
    :icon="state.isPreviewBackground ? 'pi pi-times' : 'pi pi-image'"
    @click="actions.toggleBackground"
  />
</template>
