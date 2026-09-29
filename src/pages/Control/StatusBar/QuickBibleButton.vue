<script setup lang="ts">
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import QuickBibleModal from "@/modals/QuickBible/QuickBibleModal.vue";
import { openModal } from "@/modals/openModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <Button
    type="button"
    variant="text"
    severity="secondary"
    :title="t('control.statusBar.pickVerse')"
    :aria-label="t('control.statusBar.pickVerse')"
    rounded
    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground"
    @click="openModal(QuickBibleModal)"
  >
    <template #icon><AppIcon name="app~book" size="1.25rem" /></template>
  </Button>
</template>
