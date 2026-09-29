<script setup lang="ts">
/** Clickable row of the support modal: icon, title and description. */
import Button from "primevue/button";

defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <Button
    type="button"
    variant="text"
    severity="secondary"
    class="w-full justify-start rounded-lg border border-border px-3 py-2.5 text-left font-normal text-surface-foreground hover:bg-surface-light/30"
  >
    <span class="flex w-full items-center gap-3">
      <i :class="['pi shrink-0 text-lg text-brand', icon]" />
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="text-sm font-medium">{{ title }}</span>
        <span class="text-xs text-muted-foreground">{{ description }}</span>
      </span>
      <i class="pi pi-angle-right shrink-0 text-muted-foreground" />
    </span>
  </Button>
</template>
