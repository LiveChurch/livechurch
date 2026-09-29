<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import { cn } from "@/core/utils/ClassNameUtils";
import { ADD_TYPES, type AddTypeId } from "./addTypes";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const selectedId = defineModel<AddTypeId>({ required: true });
</script>

<template>
  <nav :aria-label="t('modals.addToPlaylist.itemType')" class="flex flex-col gap-1 p-3">
    <div
      v-for="type in ADD_TYPES"
      :key="type.id"
      role="button"
      tabindex="0"
      :aria-pressed="selectedId === type.id"
      :class="
        cn(
          'flex cursor-pointer items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/60',
          selectedId === type.id
            ? 'border-brand bg-brand/10 text-brand'
            : 'border-transparent text-muted-foreground hover:bg-surface-light/30 hover:text-surface-foreground',
        )
      "
      @click="selectedId = type.id"
      @keydown.enter.prevent="selectedId = type.id"
      @keydown.space.prevent="selectedId = type.id"
    >
      <AppIcon :name="type.icon" size="20px" />
      <div class="flex min-w-0 flex-col">
        <span class="truncate text-sm font-medium">{{ type.label }}</span>
      </div>
    </div>
  </nav>
</template>
