<script setup lang="ts">
import { ref } from "vue";
import { BibleBooks } from "@/core/utils/BibleBooks";
import Modal from "../Modal.vue";
import BookGrid from "./BookGrid.vue";
import NumberGrid from "./NumberGrid.vue";
import { useQuickBible } from "./useQuickBible";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Quick verse selection: book, chapter and verse side by side. */
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const bible = useQuickBible(() => modalRef.value?.hide());

const SECTION_CLASS = "flex min-h-0 flex-col gap-2 overflow-y-auto p-4";
const TITLE_CLASS = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('common.terms.bible')"
    class-name="max-w-5xl"
    content-class-name="flex min-h-[28rem] divide-x divide-border/60 p-0"
  >
    <p v-if="bible.isLoading.value" class="p-6 text-sm text-muted-foreground">
      {{ t('modals.quickBible.loading') }}
    </p>

    <template v-else>
      <section :class="[SECTION_CLASS, 'flex-[2]']">
        <h4 :class="TITLE_CLASS">{{ t('modals.quickBible.oldTestament') }}</h4>
        <BookGrid
          :start="0"
          :end="BibleBooks.oldTestamentCount"
          :selected="bible.bookIndex.value"
          @select="bible.selectBook"
        />
        <h4 :class="[TITLE_CLASS, 'mt-2']">{{ t('modals.quickBible.newTestament') }}</h4>
        <BookGrid
          :start="BibleBooks.oldTestamentCount"
          :end="BibleBooks.count()"
          :selected="bible.bookIndex.value"
          @select="bible.selectBook"
        />
      </section>

      <section :class="[SECTION_CLASS, 'flex-1']">
        <h4 :class="TITLE_CLASS">{{ t('modals.quickBible.chapter') }}</h4>
        <NumberGrid
          :count="bible.chapterCount.value"
          :selected="bible.chapter.value"
          :label="t('modals.quickBible.chapter')"
          @select="bible.selectChapter"
        />
      </section>

      <section :class="[SECTION_CLASS, 'flex-1']">
        <h4 :class="TITLE_CLASS">{{ t('modals.quickBible.verse') }}</h4>
        <NumberGrid
          :count="bible.verseCount.value"
          :label="t('modals.quickBible.verse')"
          @select="bible.selectVerse"
        />
      </section>
    </template>
  </Modal>
</template>
