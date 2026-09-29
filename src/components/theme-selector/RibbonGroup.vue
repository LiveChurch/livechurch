<script setup lang="ts">
/** Group of commands in the style of Word's ribbon: controls on top, name below. */
defineProps<{ caption: string }>();
</script>

<template>
  <section class="flex shrink-0 flex-col items-center gap-1 border-r border-border/60 px-4 pb-1.5 pt-3">
    <div class="flex flex-1 flex-col justify-center gap-2">
      <slot />
    </div>
    <h4 class="text-[11px] text-muted-foreground">{{ caption }}</h4>
  </section>
</template>
