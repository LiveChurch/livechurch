<script setup lang="ts">
import Button from "primevue/button";
import { BibleBooks } from "@/core/utils/BibleBooks";

/** Grid of (abbreviated) books of a Bible stretch, from `start` (inclusive) to `end` (exclusive). */
defineProps<{
  start: number;
  end: number;
  selected: number | null;
}>();

const emit = defineEmits<{ (event: "select", index: number): void }>();
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1">
    <Button
      v-for="index in end - start"
      :key="start + index - 1"
      type="button"
      size="small"
      :label="BibleBooks.abbreviation(start + index - 1)"
      :title="BibleBooks.name(start + index - 1)"
      :aria-label="BibleBooks.name(start + index - 1)"
      :severity="selected === start + index - 1 ? 'primary' : 'secondary'"
      :variant="selected === start + index - 1 ? undefined : 'outlined'"
      @click="emit('select', start + index - 1)"
    />
  </div>
</template>
