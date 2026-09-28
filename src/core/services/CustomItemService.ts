import { v4 as uuidv4 } from "uuid";
import type { MediaAsset } from "@/core/types/media";
import type { PlaylistItem, Slide, SlideCountdown } from "@/core/types/playlist";
import type { SlidesTheme, ThemeBinding } from "@/core/types/theme";
import { MediaUtils } from "@/core/utils/MediaUtils";
import { SongUtils } from "@/core/utils/SongUtils";
import { StringUtils } from "@/core/utils/StringUtils";
import { I18n } from "@/core/i18n/I18n";

/** Builds and inspects playlist items created manually by the user. */
export const CustomItemService = {
  /** One slide per media item (in the received order), each showing the whole image/video. */
  buildMediaSlides(name: string, assets: MediaAsset[]): Slide[] {
    return assets.map((asset) => ({
      title: name,
      text: asset.name,
      media: MediaUtils.slideMediaOf(asset),
    }));
  },

  buildMediaItem(name: string, assets: MediaAsset[]): PlaylistItem {
    return {
      id: `media-${uuidv4()}`,
      name,
      type: "media",
      slides: CustomItemService.buildMediaSlides(name, assets),
      activeSlideIndex: 0,
    };
  },

  /** Media item from an already resolved image (e.g. an event's background), without going through the library. */
  buildImageItem(name: string, imageUrl: string): PlaylistItem {
    return {
      id: `media-${uuidv4()}`,
      name,
      type: "media",
      slides: [{ title: name, text: name, media: { kind: "image", url: imageUrl } }],
      activeSlideIndex: 0,
    };
  },

  /** Ids of the library media used by the item's slides, in slide order. */
  assetIdsOfItem(item: PlaylistItem, assets: MediaAsset[]): string[] {
    return item.slides
      .map((slide) => assets.find((asset) => MediaUtils.urlOf(asset) === slide.media?.url))
      .filter((asset): asset is MediaAsset => !!asset)
      .map((asset) => asset.id);
  },

  /** A single slide showing the countdown to today's "HH:mm" time. */
  buildCountdownSlides(name: string, countdown: SlideCountdown): Slide[] {
    return [{ title: name, text: I18n.t("core.countdown.eventAt", { time: countdown.time }), countdown }];
  },

  buildCountdownItem(
    name: string,
    countdown: SlideCountdown,
    themeBinding?: ThemeBinding | null,
    customTheme?: SlidesTheme | null,
  ): PlaylistItem {
    return {
      id: `countdown-${uuidv4()}`,
      name,
      type: "countdown",
      slides: CustomItemService.buildCountdownSlides(name, countdown),
      activeSlideIndex: 0,
      themeBinding,
      customTheme,
    };
  },

  /** Song typed by the user: one slide per stanza, without downloading lyrics. The author becomes the subtitle. */
  buildSongItem(name: string, author: string, lyrics: string): PlaylistItem {
    const slideTitle = SongUtils.slideTitle(name, author);
    const item = CustomItemService.buildFreeSlidesItem(slideTitle, lyrics);
    return {
      ...item,
      id: `song-${uuidv4()}`,
      name,
      type: "song",
      subtitle: author.trim() || undefined,
    };
  },

  /** One slide per text block separated by a blank line. */
  buildFreeSlidesItem(name: string, text: string): PlaylistItem {
    return {
      id: `free-${uuidv4()}`,
      name,
      type: "free-slides",
      slides: StringUtils.splitStanzas(text).map((block) => ({
        title: name,
        text: block,
      })),
      activeSlideIndex: 0,
    };
  },
};
