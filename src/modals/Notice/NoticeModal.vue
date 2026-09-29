<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import NoticeBanner from "@/components/slides/NoticeBanner.vue";
import type { LiveNotice, NoticePosition } from "@/core/types/live";
import Modal from "../Modal.vue";
import NoticeEffectFields from "./NoticeEffectFields.vue";
import NoticeHistoryList from "./NoticeHistoryList.vue";
import NoticeStyleFields from "./NoticeStyleFields.vue";
import NoticeTextSource from "./NoticeTextSource.vue";
import { useNoticeModal } from "./useNoticeModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Configures the one-off notice (e.g. "move your car") overlaid on the on-air slide. */
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const textFieldRef = ref<InstanceType<typeof NoticeTextSource> | null>(null);
const { draft, isVisible, hasLiveContent, canShow, show, hide, load } =
  useNoticeModal(() => modalRef.value?.hide());

const POSITION_OPTIONS: { label: string; value: NoticePosition }[] = [
  { label: t("modals.notice.aboveSlide"), value: "top" },
  { label: t("modals.notice.belowSlide"), value: "bottom" },
];

const sample = computed<LiveNotice>(() => ({
  ...draft,
  text: draft.text || t("modals.notice.preview"),
}));

const loadIntoInput = (notice: LiveNotice) => {
  load(notice);
  textFieldRef.value?.focus();
};
</script>

<template>
  <Modal ref="modalRef" :title="t('control.statusBar.notice')" class-name="max-w-4xl">
    <div class="flex gap-6">
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <NoticeTextSource ref="textFieldRef" :draft="draft" @submit="show" />

        <div class="flex flex-col gap-1.5">
          <span id="notice-position" class="text-sm font-medium text-muted-foreground">
            {{ t('modals.broadcast.position') }}
          </span>
          <SelectButton
            v-model="draft.position"
            :options="POSITION_OPTIONS"
            option-label="label"
            option-value="value"
            :allow-empty="false"
            aria-labelledby="notice-position"
          />
        </div>

        <NoticeEffectFields :draft="draft" />

        <NoticeStyleFields :draft="draft" />

        <div class="@container relative aspect-[16/5] overflow-hidden rounded-md bg-surface-light">
          <NoticeBanner :notice="sample" />
        </div>

        <p v-if="!hasLiveContent" class="text-sm text-muted-foreground">
          {{ t('modals.notice.putSlideLive') }}
        </p>
      </div>
      <NoticeHistoryList
        class="min-w-0 flex-1 border-l border-border/60 pl-6"
        @select="loadIntoInput"
      />
    </div>

    <template #footer>
      <div class="flex w-full items-center gap-3">
        <Button
          v-if="isVisible"
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-danger-hover"
          :label="t('modals.notice.hideNotice')"
          icon="pi pi-eye-slash"
          @click="hide"
        />
        <Button
          variant="text"
          severity="secondary"
          class="ml-auto text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="modalRef?.hide()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="isVisible ? 'Atualizar aviso' : 'Exibir aviso'"
          icon="pi pi-megaphone"
          :disabled="!canShow"
          @click="show"
        />
      </div>
    </template>
  </Modal>
</template>
