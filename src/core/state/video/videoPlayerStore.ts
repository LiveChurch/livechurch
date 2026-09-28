import { defineStore } from "pinia";
import { reactive } from "vue";
import { VideoCommandBus } from "@/core/services/VideoCommandBus";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { VideoAction } from "@/core/types/video";
import { NumberUtils } from "@/core/utils/NumberUtils";

const SKIP_SECONDS = 10;

/**
 * Player of the previewed video. The preview's `<video>` is the time reference;
 * when the preview is what is on air, each command also goes to the live screens.
 */
export const useVideoPlayerStore = defineStore("videoPlayer", () => {
  const playlistCtx = usePlaylistStore();

  const state = reactive({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  });

  let previewVideo: HTMLVideoElement | null = null;

  const send = (action: VideoAction, time: number) => {
    if (!previewVideo) return;
    const command = { action, time };
    VideoCommandBus.applyTo(previewVideo, command);
    if (playlistCtx.state.isPreviewLive) VideoCommandBus.publish(command);
  };

  const actions = {
    attachPreview(video: HTMLVideoElement) {
      previewVideo = video;
      actions.syncFromPreview();
    },

    /** Ignores videos that have already been replaced by another preview. */
    detachPreview(video: HTMLVideoElement) {
      if (previewVideo !== video) return;
      previewVideo = null;
      Object.assign(state, { currentTime: 0, duration: 0, isPlaying: false });
    },

    syncFromPreview() {
      if (!previewVideo) return;
      state.currentTime = previewVideo.currentTime;
      state.duration = Number.isFinite(previewVideo.duration)
        ? previewVideo.duration
        : 0;
      state.isPlaying = !previewVideo.paused && !previewVideo.ended;
    },

    play() {
      send("play", previewVideo?.currentTime ?? 0);
    },

    pause() {
      send("pause", previewVideo?.currentTime ?? 0);
    },

    seek(time: number) {
      send("seek", NumberUtils.clamp(time, 0, state.duration));
    },

    skip(seconds: number) {
      actions.seek((previewVideo?.currentTime ?? 0) + seconds);
    },

    skipForward() {
      actions.skip(SKIP_SECONDS);
    },

    skipBackward() {
      actions.skip(-SKIP_SECONDS);
    },

    restart() {
      send("play", 0);
    },
  };

  return { state, actions };
});
