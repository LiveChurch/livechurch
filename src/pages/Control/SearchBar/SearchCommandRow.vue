<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import type { SearchCommand } from "@/core/types/search";
import { cn } from "@/core/utils/ClassNameUtils";

defineProps<{
  command: SearchCommand;
  selected: boolean;
}>();
</script>

<template>
  <div
    role="option"
    :aria-selected="selected"
    :class="
      cn(
        'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5',
        selected
          ? 'bg-brand text-white'
          : 'text-muted-foreground hover:bg-surface-light/30',
      )
    "
  >
    <div class="rounded-md bg-surface-light/30 p-2">
      <AppIcon :name="command.icon === 'music' ? 'app~music' : 'app~sparkles'" size="16px" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between">
        <span class="truncate text-sm font-medium">{{ command.label }}</span>
        <span
          v-if="selected"
          class="rounded bg-surface-light/30 px-1.5 py-0.5 text-xs text-white/90"
        >
          Enter
        </span>
      </div>
      <p class="truncate text-xs opacity-80">{{ command.description }}</p>
    </div>
  </div>
</template>
