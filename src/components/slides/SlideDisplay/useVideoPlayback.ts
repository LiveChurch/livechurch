import { onBeforeUnmount, onMounted, type Ref } from "vue";
import { VideoCommandBus } from "@/core/services/VideoCommandBus";
import { useVideoPlayerStore } from "@/core/state/video/videoPlayerStore";
import type { VideoRole } from "./videoRole";

const PREVIEW_SYNC_EVENTS = [
  "loadedmetadata",
  "durationchange",
  "timeupdate",
  "seeked",
  "play",
  "pause",
  "ended",
  "emptied",
] as const;

/** The preview video reports its state to the player and receives commands from it. */
function useReportingToPlayer(videoRef: Ref<HTMLVideoElement | null>) {
  const player = useVideoPlayerStore();
  const sync = () => player.actions.syncFromPreview();

  onMounted(() => {
    const video = videoRef.value;
    if (!video) return;
    player.actions.attachPreview(video);
    PREVIEW_SYNC_EVENTS.forEach((name) => video.addEventListener(name, sync));
  });

  onBeforeUnmount(() => {
    const video = videoRef.value;
    if (!video) return;
    PREVIEW_SYNC_EVENTS.forEach((name) => video.removeEventListener(name, sync));
    player.actions.detachPreview(video);
  });
}

/** Live videos only obey the preview player's commands. */
function useFollowingPlayer(videoRef: Ref<HTMLVideoElement | null>) {
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = VideoCommandBus.subscribe((command) => {
      if (videoRef.value) VideoCommandBus.applyTo(videoRef.value, command);
    });
  });

  onBeforeUnmount(() => unsubscribe?.());
}

export function useVideoPlayback(
  videoRef: Ref<HTMLVideoElement | null>,
  role: VideoRole,
) {
  if (role === "preview") useReportingToPlayer(videoRef);
  else useFollowingPlayer(videoRef);
}
