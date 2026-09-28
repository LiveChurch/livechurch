<script setup lang="ts">
import Button from "primevue/button";
import AddToPlaylistModal from "@/modals/AddToPlaylist/AddToPlaylistModal.vue";
import { openModal } from "@/modals/openModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <Button
    type="button"
    variant="text"
    severity="secondary"
    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/30 hover:text-surface-foreground"
    icon="pi pi-plus"
    :title="t('control.playlist.addToPlaylist')"
    :aria-label="t('control.playlist.addToPlaylist')"
    @click="openModal(AddToPlaylistModal)"
  />
</template>
