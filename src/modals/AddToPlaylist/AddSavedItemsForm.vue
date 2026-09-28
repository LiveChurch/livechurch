<script setup lang="ts">
/** Lists the saved items for the user to add them to the active playlist. */
import { computed, ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import { useSavedItemsStore } from "@/core/state/playlist/savedItemsStore";
import type { PlaylistItem } from "@/core/types/playlist";
import { StringUtils } from "@/core/utils/StringUtils";
import { SavedItemUtils } from "@/core/utils/SavedItemUtils";
import Alert from "@/modals/Alert";
import SavedItemRow from "./SavedItemRow.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emit = defineEmits<{
  create: [item: PlaylistItem];
  cancel: [];
}>();

const savedItemsStore = useSavedItemsStore();

const search = ref<string | number | null>("");

const filteredItems = computed(() => {
  const query = StringUtils.normalize(String(search.value ?? "").trim());
  return savedItemsStore.state.items.filter((item) =>
    StringUtils.normalize(item.name).includes(query),
  );
});

const confirmRemove = async (item: PlaylistItem) => {
  const confirmed = await Alert.show({
    title: t("modals.addToPlaylist.removeSavedTitle"),
    message: t("modals.addToPlaylist.removeSavedConfirm", { name: item.name }),
    confirmText: t("common.actions.remove"),
    isDestructive: true,
  });
  if (confirmed) savedItemsStore.actions.remove(item.id);
};
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <div
      v-if="savedItemsStore.state.items.length === 0"
      class="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center text-muted-foreground"
    >
      <span class="font-medium">{{ t('modals.addToPlaylist.noSavedItems') }}</span>
      <span class="text-sm opacity-70">
        {{ t('modals.addToPlaylist.saveHint') }}
      </span>
    </div>
    <div v-else class="flex min-h-0 flex-1 flex-col gap-2 p-4">
      <Input v-model="search" :placeholder="t('modals.addToPlaylist.search')" icon="pi-search" clearable />
      <span
        v-if="filteredItems.length === 0"
        class="p-6 text-center text-sm text-muted-foreground"
      >
        {{ t('modals.addToPlaylist.noItemsFound') }}
      </span>
      <div class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        <SavedItemRow
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :in-playlist="savedItemsStore.actions.isInActivePlaylist(item)"
          @add="emit('create', SavedItemUtils.instantiate(item))"
          @remove="() => void confirmRemove(item)"
        />
      </div>
    </div>

    <div class="flex justify-end border-t border-border/60 p-4">
      <Button
        variant="text"
        severity="secondary"
        class="text-muted-foreground hover:text-surface-foreground"
        :label="t('common.actions.close')"
        @click="emit('cancel')"
      />
    </div>
  </div>
</template>
