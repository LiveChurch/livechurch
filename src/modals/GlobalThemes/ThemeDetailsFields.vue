<script setup lang="ts">
import Input from "@/components/ui/Input.vue";
import MultiSelect from "@/components/ui/MultiSelect.vue";
import { ThemeCategories } from "@/core/state/theme/themeCategories";
import type { SlidesTheme } from "@/core/types/theme";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{ theme: SlidesTheme }>();
</script>

<template>
  <div class="flex flex-col gap-5 p-6">
    <Input
      :model-value="props.theme.name || ''"
      :label="t('modals.globalThemes.themeName')"
      @update:model-value="props.theme.name = String($event ?? '')"
    />
    <MultiSelect
      :model-value="props.theme.categories ?? []"
      :options="ThemeCategories.options"
      :label="t('modals.globalThemes.categories')"
      :placeholder="t('modals.globalThemes.allCategories')"
      :hint="t('modals.globalThemes.categoriesHint')"
      @update:model-value="props.theme.categories = $event"
    />
  </div>
</template>
