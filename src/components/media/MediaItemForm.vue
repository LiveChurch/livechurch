<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ItemFormFrame from "@/components/playlist/ItemFormFrame.vue";
import { CustomItemService } from "@/core/services/CustomItemService";
import { useMediaStore } from "@/core/state/media/mediaStore";
import type { MediaAsset } from "@/core/types/media";
import type { PlaylistItem } from "@/core/types/playlist";
import MediaPicker from "./MediaPicker.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Media item form: name + images/videos (one per slide). Used to
 * create (without `item`) and to edit (with `item`, with the current media
 * already selected in slide order).
 */
const props = withDefaults(
  defineProps<{ item?: PlaylistItem; submitLabel?: string }>(),
  { item: undefined },
);

const emit = defineEmits<{
  submit: [name: string, assets: MediaAsset[]];
  cancel: [];
}>();

const mediaCtx = useMediaStore();
const selectedIds = ref<string[]>([]);

// The library loads asynchronously; the initial selection waits for it.
watch(
  () => mediaCtx.state.isHydrated,
  (isHydrated) => {
    if (isHydrated && props.item) {
      selectedIds.value = CustomItemService.assetIdsOfItem(
        props.item,
        mediaCtx.state.assets,
      );
    }
  },
  { immediate: true },
);

const selectedAssets = computed(() =>
  selectedIds.value
    .map((id) => mediaCtx.state.assets.find((asset) => asset.id === id))
    .filter((asset): asset is MediaAsset => !!asset),
);
</script>

<template>
  <ItemFormFrame
    :can-submit="selectedAssets.length > 0"
    :initial-name="props.item?.name"
    :suggested-name="selectedAssets[0]?.name"
    :submit-label="props.submitLabel ?? t('common.actions.create')"
    @submit="(name) => emit('submit', name, selectedAssets)"
    @cancel="emit('cancel')"
  >
    <MediaPicker v-model="selectedIds" />
  </ItemFormFrame>
</template>
