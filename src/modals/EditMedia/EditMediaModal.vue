<script setup lang="ts">
import { computed, ref } from "vue";
import MediaItemForm from "@/components/media/MediaItemForm.vue";
import { CustomItemService } from "@/core/services/CustomItemService";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { MediaAsset } from "@/core/types/media";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{ itemId: string }>();

const playlistCtx = usePlaylistStore();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const item = computed(() =>
  playlistCtx.state.playlist.find((entry) => entry.id === props.itemId),
);

const handleSubmit = (name: string, assets: MediaAsset[]) => {
  playlistCtx.actions.updateItemContent(
    props.itemId,
    name,
    CustomItemService.buildMediaSlides(name, assets),
  );
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('modals.editMedia.title')"
    class-name="h-[80vh] w-full max-w-3xl"
    content-class-name="flex overflow-hidden p-0"
  >
    <MediaItemForm
      v-if="item"
      :item="item"
      :submit-label="t('common.actions.save')"
      @submit="handleSubmit"
      @cancel="close()"
    />
  </Modal>
</template>
