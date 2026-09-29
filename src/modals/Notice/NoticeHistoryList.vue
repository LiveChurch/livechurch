<script setup lang="ts">
import Button from "primevue/button";
import { useNoticeHistoryStore } from "@/core/state/notice/noticeHistoryStore";
import type { LiveNotice, NoticePosition } from "@/core/types/live";
import { NoticeUtils } from "@/core/utils/NoticeUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Previous notices: bring back to the field (to adjust and show) or remove from the list. */
const emit = defineEmits<{
  select: [notice: LiveNotice];
}>();

const history = useNoticeHistoryStore();

const POSITION_LABELS: Record<NoticePosition, string> = {
  top: t("modals.notice.aboveSlide"),
  bottom: t("modals.notice.belowSlide"),
};
</script>

<template>
  <section class="flex flex-col gap-1.5">
    <h4 class="text-sm font-medium text-muted-foreground">{{ t('modals.notice.previousNotices') }}</h4>
    <p v-if="history.state.items.length === 0" class="text-sm text-muted-foreground/70">
      {{ t('modals.notice.historyHint') }}
    </p>
    <ul v-else class="flex flex-col gap-1">
      <li
        v-for="entry in history.state.items"
        :key="entry.id"
        class="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 transition-colors hover:bg-surface-light/30"
      >
        <span
          class="shrink-0 rounded px-2 py-1 text-xs font-bold"
          :style="{ backgroundColor: entry.backgroundColor, color: entry.textColor }"
          aria-hidden="true"
        >
          Aa
        </span>
        <div class="flex min-w-0 flex-1 flex-col">
          <span class="truncate text-sm font-medium">{{ entry.text }}</span>
          <span class="text-xs opacity-60">
            {{ POSITION_LABELS[entry.position] }}
            <template v-if="entry.effect === 'marquee'"> · {{ t('modals.notice.marqueeShort') }}</template>
          </span>
        </div>
        <Button
          type="button"
          variant="text"
          severity="secondary"
          :aria-label="`Usar aviso ${entry.text}`"
          :title="t('modals.notice.loadIntoField')"
          class="rounded p-1 text-muted-foreground hover:text-surface-foreground"
          icon="pi pi-arrow-up"
          @click="emit('select', NoticeUtils.fromEntry(entry))"
        />
        <Button
          type="button"
          variant="text"
          severity="secondary"
          :aria-label="`Remover aviso ${entry.text}`"
          :title="t('modals.notice.removeFromHistory')"
          class="rounded p-1 text-muted-foreground hover:text-danger-hover"
          icon="pi pi-trash"
          @click="history.actions.remove(entry.id)"
        />
      </li>
    </ul>
  </section>
</template>
