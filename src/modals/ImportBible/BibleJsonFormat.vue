<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const EXAMPLE = `[
  {
    "abbrev": "gn",
    "name": "Gênesis",
    "chapters": [
      ["No princípio...", "Era a terra..."],
      ["Assim foram..."]
    ]
  }
]`;
</script>

<template>
  <section class="flex flex-col gap-2 rounded-lg border border-border bg-surface-light/30 p-3">
    <h4 class="text-sm font-medium">{{ t('modals.importBible.formatTitle') }}</h4>
    <pre class="overflow-x-auto rounded-md bg-media p-2 font-mono text-xs">{{ EXAMPLE }}</pre>
    <ul class="flex list-disc flex-col gap-1 pl-4 text-xs text-muted-foreground">
      <li>{{ t('modals.importBible.ruleBooks') }}</li>
      <li>{{ t('modals.importBible.ruleChapters') }}</li>
      <li>{{ t('modals.importBible.ruleFields') }}</li>
    </ul>
  </section>
</template>
