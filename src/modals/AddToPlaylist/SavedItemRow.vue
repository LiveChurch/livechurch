<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import type { PlaylistItem } from "@/core/types/playlist";
import { PlaylistItemIcons } from "@/core/utils/PlaylistItemIcons";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  item: PlaylistItem;
  /** The item is already in the active playlist, so it cannot be added again. */
  inPlaylist: boolean;
}>();

const emit = defineEmits<{
  add: [];
  remove: [];
}>();

const iconName = computed(() => PlaylistItemIcons.forType(props.item.type));
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2 transition-colors hover:bg-surface-light/30"
  >
    <div class="flex shrink-0 items-center justify-center rounded bg-surface-light/30 p-1.5">
      <AppIcon :name="iconName" size="16px" />
    </div>
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-sm font-medium">{{ item.name }}</span>
      <span v-if="item.subtitle" class="truncate text-xs opacity-60">
        {{ item.subtitle }}
      </span>
    </div>
    <Button
      type="button"
      variant="text"
      severity="secondary"
      :aria-label="`Remover ${item.name} dos itens salvos`"
      class="rounded p-1 text-muted-foreground hover:text-danger-hover"
      icon="pi pi-trash"
      @click="emit('remove')"
    />
    <Button
      type="button"
      class="bg-primary text-white hover:bg-primary-hover"
      :label="inPlaylist ? t('modals.addToPlaylist.inPlaylist') : t('common.actions.add')"
      :disabled="inPlaylist"
      @click="emit('add')"
    />
  </div>
</template>
