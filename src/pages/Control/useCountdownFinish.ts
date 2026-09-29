import { computed, watch } from "vue";
import { useClock } from "@/core/composables/useClock";
import { DEFAULT_FINAL_MESSAGE_SECONDS } from "@/core/constants/countdown";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useThemeStore } from "@/core/state/theme/themeStore";
import { useVideoPlayerStore } from "@/core/state/video/videoPlayerStore";
import type { Playlist, PlaylistItem, SlideCountdown } from "@/core/types/playlist";
import { TimeUtils } from "@/core/utils/TimeUtils";

/**
 * When the on-air countdown reaches zero, runs what the item asked for:
 * go to the next item and/or remove it from the playlist. Lives in the control window
 * because the store is also created in the projector window, which must not act on its own.
 */
export function useCountdownFinish() {
  const { state, actions } = usePlaylistStore();
  const themeStore = useThemeStore();
  const videoPlayer = useVideoPlayerStore();
  const { now } = useClock(1000);

  const liveCountdown = computed(() => {
    const countdown = state.liveContent?.slide.countdown;
    const itemId = state.liveContent?.playlistItemId;
    return countdown && itemId ? { itemId, countdown } : null;
  });

  const secondsLeft = computed(() =>
    liveCountdown.value
      ? TimeUtils.secondsUntil(liveCountdown.value.countdown.time, now.value)
      : null,
  );

  const playlistOf = (itemId: string): Playlist | undefined =>
    state.playlists.find((playlist) => playlist.items.some((item) => item.id === itemId));

  const nextItemAfter = (itemId: string): PlaylistItem | undefined => {
    const items = playlistOf(itemId)?.items ?? [];
    return items[items.findIndex((item) => item.id === itemId) + 1];
  };

  const goLiveWithItem = async (item: PlaylistItem) => {
    const playlist = playlistOf(item.id);
    if (playlist) actions.setActivePlaylistId(playlist.id);
    actions.setActiveItemId(item.id);
    const slide = state.slides[state.activeSlideIndex];
    if (!slide) return;
    actions.setLiveItemId(item.id);
    await actions.goLive(slide, themeStore.actions.resolveThemeBinding(item.themeBinding));
    if (slide.media?.kind === "video") videoPlayer.actions.restart();
  };

  /** Leaves the final message on air for the configured time. Returns whether the item stays on air after it. */
  const showFinalMessage = async (itemId: string, countdown: SlideCountdown) => {
    if (!countdown.finalMessage) return true;
    const seconds = countdown.finalMessageSeconds || DEFAULT_FINAL_MESSAGE_SECONDS;
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    return state.liveContent?.playlistItemId === itemId;
  };

  const finish = async (itemId: string, countdown: SlideCountdown) => {
    const { finishAction = "none", removeWhenDone } = countdown;
    if (finishAction === "none" && !removeWhenDone) return;
    if (!(await showFinalMessage(itemId, countdown))) return;

    const next = finishAction === "next-item" ? nextItemAfter(itemId) : undefined;
    if (next) await goLiveWithItem(next);
    else if (finishAction === "waiting-screen" || removeWhenDone) await actions.stopLive();
    if (removeWhenDone) actions.removeFromPlaylist(itemId);
  };

  // Only fires on the turn to zero with the same item on air: going on air after
  // the time, or switching countdowns, does not count as finishing.
  watch(
    () => [liveCountdown.value?.itemId, secondsLeft.value] as const,
    ([itemId, seconds], [previousItemId, previousSeconds]) => {
      const countdown = liveCountdown.value;
      const justFinished = seconds === 0 && !!previousSeconds && itemId === previousItemId;
      if (countdown && justFinished) void finish(countdown.itemId, countdown.countdown);
    },
  );
}
