<script setup lang="ts">
import Button from "primevue/button";

/** Grid of numbered buttons (chapters or verses). */
defineProps<{
  count: number;
  selected?: number | null;
  label: string;
}>();

const emit = defineEmits<{ (event: "select", value: number): void }>();
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1">
    <Button
      v-for="number in count"
      :key="number"
      type="button"
      size="small"
      :label="String(number)"
      :aria-label="`${label} ${number}`"
      :severity="selected === number ? 'primary' : 'secondary'"
      :variant="selected === number ? undefined : 'outlined'"
      @click="emit('select', number)"
    />
  </div>
</template>
