import { desktop } from "@/core/services/DesktopService";
import type { VideoCommand } from "@/core/types/video";

type VideoCommandListener = (command: VideoCommand) => void;

/** Position difference tolerated before repositioning an already synced video. */
const SYNC_TOLERANCE_SECONDS = 0.5;

const localListeners = new Set<VideoCommandListener>();

/**
 * Playback command channel for the screens that show the live video:
 * the ones in the window itself (Live Output) and the projector window (via desktop).
 */
export const VideoCommandBus = {
  publish(command: VideoCommand) {
    localListeners.forEach((listener) => listener(command));
    desktop.sendVideoCommand(command).catch((error) => {
      console.error("Falha ao enviar comando de vídeo ao projetor", error);
    });
  },

  subscribe(listener: VideoCommandListener): () => void {
    localListeners.add(listener);
    const unsubscribeDesktop = desktop.onVideoCommand(listener);
    return () => {
      localListeners.delete(listener);
      unsubscribeDesktop();
    };
  },

  applyTo(video: HTMLVideoElement, command: VideoCommand) {
    const drift = Math.abs(video.currentTime - command.time);
    if (command.action === "seek" || drift > SYNC_TOLERANCE_SECONDS) {
      video.currentTime = command.time;
    }
    if (command.action === "play") {
      video.play().catch((error) => {
        console.error("Falha ao reproduzir o vídeo", error);
      });
    }
    if (command.action === "pause") video.pause();
  },
};
