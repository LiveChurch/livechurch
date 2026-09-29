<script setup lang="ts" generic="T extends string">
import Button from "primevue/button";
import { cn } from "@/core/utils/ClassNameUtils";

defineProps<{
  tabs: readonly { id: T; label: string }[];
}>();

const active = defineModel<T>({ required: true });
</script>

<template>
  <div class="flex flex-wrap items-center gap-1 border-b border-border/60 px-4 py-2">
    <Button
      v-for="tab in tabs"
      :key="tab.id"
      variant="text"
      severity="secondary"
      :label="tab.label"
      :class="
        cn(
          'px-3 py-1.5 text-xs font-medium transition-colors',
          active === tab.id
            ? 'text-brand'
            : 'text-muted-foreground hover:text-surface-foreground',
        )
      "
      @click="active = tab.id"
    />
  </div>
</template>
