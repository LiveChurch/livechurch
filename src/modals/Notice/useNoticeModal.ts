import { computed, reactive } from "vue";
import { DEFAULT_NOTICE } from "@/core/constants/notice";
import { useNoticeHistoryStore } from "@/core/state/notice/noticeHistoryStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { LiveNotice } from "@/core/types/live";
import { NoticeUtils } from "@/core/utils/NoticeUtils";

/**
 * Notice draft: starts from the on-air notice or, without one, from the style of the last one used.
 * Only shown with something on air.
 */
export function useNoticeModal(close: () => void) {
  const { state, actions } = usePlaylistStore();
  const history = useNoticeHistoryStore();

  const lastEntry = history.state.items[0];
  const initial =
    state.notice ??
    (lastEntry ? { ...NoticeUtils.fromEntry(lastEntry), text: "" } : DEFAULT_NOTICE);
  const draft = reactive<LiveNotice>({ ...initial });

  const isVisible = computed(() => !!state.notice);
  const hasLiveContent = computed(() => !!state.liveContent);
  const canShow = computed(
    () => hasLiveContent.value && draft.text.trim() !== "",
  );

  const show = () => {
    if (!canShow.value) return;
    const notice = { ...draft, text: draft.text.trim() };
    history.actions.add(notice);
    void actions.showNotice(notice);
    close();
  };

  const hide = () => {
    void actions.hideNotice();
    close();
  };

  /** Brings a notice from the history into the draft, to be adjusted and shown. */
  const load = (notice: LiveNotice) => Object.assign(draft, notice);

  return { draft, isVisible, hasLiveContent, canShow, show, hide, load };
}
