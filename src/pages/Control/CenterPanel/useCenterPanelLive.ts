import { computed, type ComputedRef } from "vue";
import type { Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useVideoPlayerStore } from "@/core/state/video/videoPlayerStore";
import EditCountdownModal from "@/modals/EditCountdown/EditCountdownModal.vue";
import EditMediaModal from "@/modals/EditMedia/EditMediaModal.vue";
import { openModal } from "@/modals/openModal";
import TextEditorModal from "@/modals/TextEditor/TextEditorModal.vue";

/**
 * Preview/live logic of the CenterPanel (port of `useCenterPanelLive.ts`):
 * current slide, "on air" badge, slide editing and live sending.
 * Unlike React, it receives the resolved theme as a `ComputedRef`.
 */
export function useCenterPanelLive(resolvedTheme: ComputedRef<SlidesTheme>) {
  const playlistCtx = usePlaylistStore();
  const { actions } = playlistCtx;
  const videoPlayer = useVideoPlayerStore();

  const currentSlide = computed<Slide | null>(
    () =>
      playlistCtx.state.slides[playlistCtx.state.activeSlideIndex] ?? null,
  );

  const previewSlide = computed<Slide | null>(() => {
    const activeItem = playlistCtx.state.activeItem;
    return (
      currentSlide.value ??
      (activeItem ? { text: activeItem.name, title: "" } : null)
    );
  });

  const isPreviewLive = computed(() => playlistCtx.state.isPreviewLive);

  const previewHeadline = computed(() => {
    const activeItem = playlistCtx.state.activeItem;
    return activeItem?.type === "bible-verse"
      ? (currentSlide.value?.title ?? "")
      : (activeItem?.name ?? "");
  });

  /** Verses come from the Bible and are not editable; the other items are. */
  const canEditSlides = computed(() => {
    const type = playlistCtx.state.activeItem?.type;
    return type !== "bible-verse";
  });

  const handleEditSlides = () => {
    const activeItem = playlistCtx.state.activeItem;
    if (activeItem?.type === "media") {
      openModal(EditMediaModal, { itemId: activeItem.id });
      return;
    }
    if (activeItem?.type === "countdown") {
      openModal(EditCountdownModal, { itemId: activeItem.id });
      return;
    }

    openModal(TextEditorModal, {
      initialText: playlistCtx.state.slides
        .map((slide: Slide) => slide.text)
        .join("\n\n"),
      onSave: (text: string) => {
        if (playlistCtx.state.activeItem) {
          actions.updateSlides(playlistCtx.state.activeItem.id, text);
        }
      },
      title: `Editar Slides - ${playlistCtx.state.activeItem?.name ?? ""}`,
    });
  };

  const handleGoLive = () => {
    const activeItem = playlistCtx.state.activeItem;
    const slide = currentSlide.value;
    if (activeItem && slide) {
      actions.setLiveItemId(activeItem.id);
      void actions.goLive(slide, resolvedTheme.value);
      // The live screens start the video from the beginning; the preview follows.
      if (slide.media?.kind === "video") videoPlayer.actions.restart();
    }
  };

  const canPauseLive = computed(() => playlistCtx.state.canPauseLive);

  return {
    currentSlide,
    canPauseLive,
    handlePauseLive: actions.pauseLive,
    previewSlide,
    isPreviewLive,
    previewHeadline,
    canEditSlides,
    handleEditSlides,
    handleGoLive,
  };
}
