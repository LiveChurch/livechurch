<script setup lang="ts">
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import { cn } from "@/core/utils/ClassNameUtils";

const props = defineProps<{
  icon: string;
  label: string;
  active?: boolean;
}>();

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <Button
    variant="text"
    severity="secondary"
    :title="props.label"
    :aria-label="props.label"
    :aria-pressed="props.active"
    :class="
      cn(
        'inline-flex items-center rounded-md px-2 py-1.5 transition-colors',
        props.active
          ? 'bg-brand/15 text-brand'
          : 'text-muted-foreground hover:bg-surface-light/60 hover:text-surface-foreground',
      )
    "
    @click="emit('click')"
  >
    <template #icon>
      <AppIcon :name="props.icon" size="18px" />
    </template>
  </Button>
</template>
