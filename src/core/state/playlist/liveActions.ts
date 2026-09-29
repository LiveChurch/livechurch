import { toRaw } from "vue";
import type { LiveNotice } from "@/core/types/live";
import type { LiveContent, PlaylistItem, Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { desktop } from "@/core/services/DesktopService";
import { PlaylistFocus } from "./PlaylistFocus";
import type { PlaylistState } from "./playlistTypes";

/** Item and slide to broadcast; by default, the ones in preview. */
interface LiveTarget {
  item: PlaylistItem | undefined;
  slideIndex: number;
}

function buildLivePayload(
  state: PlaylistState,
  slide: Slide,
  theme: SlidesTheme,
  target: LiveTarget = { item: state.activeItem, slideIndex: state.activeSlideIndex },
): LiveContent {
  // Media slides carry the whole image; sending only the current one avoids
  // resending all the item's images on every slide change.
  const slides = slide.media ? [slide] : state.slides;

  // JSON deep-clone removes Vue proxies and guarantees an immutable payload.
  return JSON.parse(
    JSON.stringify({
      slides,
      slideIndex: target.slideIndex,
      slide,
      theme,
      itemType: target.item?.type ?? "song",
      bibleVersion: state.activeBibleVersion,
      playlistItemId: target.item?.id ?? undefined,
      backgroundSeed: target.item?.backgroundSeed,
    }),
  ) as LiveContent;
}

/** Sends the on-air content to the projector with the current notice (the notice is not persisted along with the content). */
async function broadcastLive(state: PlaylistState, openProjector: boolean) {
  const content = state.liveContent;
  if (!content) return;

  try {
    if (openProjector) await desktop.ensureProjectorWindow(state.projectorMonitorId);
    await desktop.sendLiveUpdate({
      ...toRaw(content),
      notice: state.notice ? { ...state.notice } : null,
    });
  } catch (error) {
    console.error("Falha ao enviar atualização ao projetor", error);
  }
}

async function publishLive(
  state: PlaylistState,
  slide: Slide,
  theme: SlidesTheme,
  openProjector: boolean,
  target?: LiveTarget,
) {
  state.liveContent = buildLivePayload(state, slide, theme, target);
  await broadcastLive(state, openProjector);
}

export function createLiveActions(state: PlaylistState) {
  return {
    setLiveItemId(id: string) {
      state.liveItemId = id;
    },

    /** Explicit user action (play): opens the projector if needed and resumes the broadcast. */
    async goLive(slide: Slide, theme: SlidesTheme, openProjector = true) {
      state.livePaused = false;
      await publishLive(state, slide, theme, openProjector);
    },

    /** Broadcasts a media slide without bringing it to the preview (e.g. standby screen). */
    async goLiveSlide(item: PlaylistItem, slideIndex: number, theme: SlidesTheme) {
      const slide = item.slides[slideIndex];
      if (!slide) return;
      state.liveItemId = item.id;
      state.livePaused = false;
      await publishLive(state, slide, theme, false, { item, slideIndex });
    },

    /** Follows the slide change: never opens the projector and respects the pause. */
    async updateLive(slide: Slide, theme: SlidesTheme) {
      if (state.livePaused) return;
      await publishLive(state, slide, theme, false);
    },

    /** Resends what is on air, so a newly opened output window receives it. */
    async resendLive() {
      await broadcastLive(state, false);
    },

    pauseLive() {
      state.livePaused = true;
    },

    /** Brings to the preview the item and slide that are on air, switching playlists if needed. */
    focusLiveInPreview() {
      const live = state.liveContent;
      if (live?.playlistItemId) {
        PlaylistFocus.slide(state, live.playlistItemId, live.slideIndex);
      }
    },

    async showNotice(notice: LiveNotice) {
      state.notice = { ...notice };
      await broadcastLive(state, false);
    },

    async hideNotice() {
      state.notice = null;
      await broadcastLive(state, false);
    },

    async clearLive() {
      state.notice = null;
      state.liveContent = null;
      state.liveItemId = null;
      state.livePaused = false;
      try {
        await desktop.sendLiveUpdate(null);
      } catch (error) {
        console.error("Falha ao limpar transmissão ao vivo", error);
      }
    },

    setProjectorMonitorId(id: string | null) {
      state.projectorMonitorId = id;
    },

    async identifyMonitor(monitorId: string) {
      await desktop.identifyMonitor(monitorId);
    },
  };
}
