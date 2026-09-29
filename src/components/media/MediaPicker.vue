<script setup lang="ts">
import Button from "primevue/button";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import SelectableCard from "@/components/ui/SelectableCard.vue";
import { desktop } from "@/core/services/DesktopService";
import { useMediaStore } from "@/core/state/media/mediaStore";
import type { MediaAsset } from "@/core/types/media";
import { StringUtils } from "@/core/utils/StringUtils";
import Alert from "@/modals/Alert";
import MediaThumbnail from "./MediaThumbnail.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Upload of images and videos + gallery of the media already uploaded, with multiple
 * selection. The model stores the selected ids in click order.
 */
const selectedIds = defineModel<string[]>({ required: true });

const mediaCtx = useMediaStore();

// Videos are referenced by their path on disk, which only Electron exposes.
const canAddVideo = desktop.platform === "electron";

const orderOf = (assetId: string) => selectedIds.value.indexOf(assetId) + 1;

const toggle = (assetId: string) => {
  const index = selectedIds.value.indexOf(assetId);
  if (index >= 0) selectedIds.value.splice(index, 1);
  else selectedIds.value.push(assetId);
};

const handleUpload = (dataUrl: string, fileName: string) => {
  void mediaCtx.actions.addImage(StringUtils.removeExtension(fileName), dataUrl);
};

const handleVideoUpload = (filePath: string, fileName: string) => {
  void mediaCtx.actions.addVideo(StringUtils.removeExtension(fileName), filePath);
};

const confirmRemove = async (asset: MediaAsset) => {
  const confirmed = await Alert.show({
    title: t("components.media.removeTitle"),
    message: t("components.media.removeConfirm", { name: asset.name }),
    confirmText: t("common.actions.remove"),
    isDestructive: true,
  });
  if (!confirmed) return;

  const index = selectedIds.value.indexOf(asset.id);
  if (index >= 0) selectedIds.value.splice(index, 1);
  await mediaCtx.actions.removeAsset(asset.id);
};
</script>

<template>
  <ImageUpload
    multiple
    compact
    :accept-video="canAddVideo"
    :aria-label="canAddVideo ? t('components.media.uploadImagesOrVideos') : t('components.media.uploadImages')"
    @select="handleUpload"
    @select-video="handleVideoUpload"
  />

  <div class="flex min-h-0 flex-1 flex-col gap-2">
    <div class="flex items-baseline justify-between gap-2">
      <p class="text-sm font-medium text-muted-foreground">{{ t('components.media.uploaded') }}</p>
      <p class="text-xs text-muted-foreground/70">
        {{
          selectedIds.length > 0
            ? t("components.media.selectedCount", { count: selectedIds.length })
            : t("components.media.selectOneOrMore")
        }}
      </p>
    </div>

    <div
      v-if="mediaCtx.state.assets.length > 0"
      class="custom-scrollbar grid min-h-0 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] content-start gap-x-3 gap-y-4 overflow-y-auto p-1"
    >
      <SelectableCard
        v-for="asset in mediaCtx.state.assets"
        :key="asset.id"
        :label="asset.name"
        :selected="orderOf(asset.id) > 0"
        @select="toggle(asset.id)"
      >
        <MediaThumbnail :asset="asset" />
        <Button
          type="button"
          variant="text"
          severity="secondary"
          icon="pi pi-trash"
          :aria-label="t('components.media.removeAsset', { name: asset.name })"
          class="absolute left-1.5 top-1.5 rounded bg-surface p-1 text-inherit opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 hover:text-danger-hover"
          @click.stop="confirmRemove(asset)"
          @keydown.stop
        />
        <span
          v-if="orderOf(asset.id) > 0"
          class="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-solid text-xs font-bold text-white"
        >
          {{ orderOf(asset.id) }}
        </span>
      </SelectableCard>
    </div>
    <p v-else class="text-xs text-muted-foreground/70">
      {{ t('components.media.empty') }}
    </p>
  </div>
</template>
