<script setup lang="ts" generic="T extends string">
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import { cn } from "@/core/utils/ClassNameUtils";

/** Underlined tabs (the ones in the theme modal); `icon` is an AppIcon name. */
defineProps<{
  tabs: readonly { id: T; label: string; icon?: string }[];
}>();

const active = defineModel<T>({ required: true });
</script>

<template>
  <div class="flex border-b border-border/60 px-2" role="tablist">
    <Button
      v-for="tab in tabs"
      :key="tab.id"
      variant="text"
      severity="secondary"
      role="tab"
      :aria-selected="active === tab.id"
      :class="
        cn(
          'flex items-center gap-1.5 rounded-none border-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
          active === tab.id
            ? 'border-brand text-brand'
            : 'border-transparent text-muted-foreground hover:text-surface-foreground',
        )
      "
      @click="active = tab.id"
    >
      <AppIcon v-if="tab.icon" :name="tab.icon" size="16px" />
      {{ tab.label }}
    </Button>
  </div>
</template>
