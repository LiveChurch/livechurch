<script setup lang="ts">
// API: props { name: string; size?: string } + classes via fallthrough.
import { computed } from "vue";
import { APP_ICONS, type AppIconName } from "@/core/constants/icons";

/**
 * Material Icons icon (replacement for Quasar's `q-icon`).
 *
 * Resolves semantic names with the `app~` prefix (e.g. `app~search`) via the
 * `APP_ICONS` map — same convention as Quasar's old `iconMapFn` — and accepts
 * direct font names (`menu`, `text_decrease`...).
 */
const props = defineProps<{
  name: string;
  size?: string;
}>();

const glyph = computed(() => {
  if (props.name.startsWith("app~")) {
    const name = props.name.slice("app~".length) as AppIconName;
    return APP_ICONS[name] ?? "question_mark";
  }
  return props.name;
});

const style = computed(() =>
  props.size ? { fontSize: props.size } : undefined,
);
</script>

<template>
  <span class="app-icon shrink-0" :style="style" aria-hidden="true">{{
    glyph
  }}</span>
</template>
