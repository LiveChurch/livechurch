<script setup lang="ts">
/** Collapsible block of a theme editor group: title + content. */
withDefaults(defineProps<{ title: string; open?: boolean }>(), { open: true });
</script>

<template>
  <details :open="open" class="group/block border-b border-border/60 last:border-b-0">
    <summary
      class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-surface-foreground [&::-webkit-details-marker]:hidden"
    >
      {{ title }}
      <i class="pi pi-chevron-down text-[10px] transition-transform group-open/block:rotate-180" />
    </summary>
    <slot />
  </details>
</template>
