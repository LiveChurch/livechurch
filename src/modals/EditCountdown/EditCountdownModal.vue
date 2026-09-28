<script setup lang="ts">
import { computed, ref } from "vue";
import CountdownItemForm from "@/components/countdown/CountdownItemForm.vue";
import { CustomItemService } from "@/core/services/CustomItemService";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { SlideCountdown } from "@/core/types/playlist";
import type { SlidesTheme, ThemeBinding } from "@/core/types/theme";
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

const handleSubmit = (
  name: string,
  countdown: SlideCountdown,
  themeBinding: ThemeBinding | null,
  customTheme: SlidesTheme | null,
) => {
  playlistCtx.actions.updateItemContent(
    props.itemId,
    name,
    CustomItemService.buildCountdownSlides(name, countdown),
  );
  playlistCtx.actions.setItemThemeBinding(props.itemId, themeBinding);
  playlistCtx.actions.setItemCustomTheme(props.itemId, customTheme);
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('modals.editCountdown.title')"
    class-name="max-w-xl"
    content-class-name="flex overflow-hidden p-0"
  >
    <CountdownItemForm
      v-if="item"
      :item="item"
      :submit-label="t('common.actions.save')"
      @submit="handleSubmit"
      @cancel="close()"
    />
  </Modal>
</template>
