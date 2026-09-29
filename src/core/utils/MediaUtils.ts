import type { MediaAsset, SlideMedia } from "@/core/types/media";

/** Scheme served by Electron (`electron/mediaProtocol.mjs`) for videos on disk. */
const LOCAL_FILE_SCHEME = "livechurch-media";

export const MediaUtils = {
  localFileUrl(filePath: string): string {
    return `${LOCAL_FILE_SCHEME}://local/${encodeURIComponent(filePath)}`;
  },

  /** Displayable URL of the media: data URL for images, local protocol for videos. */
  urlOf(asset: MediaAsset): string {
    return asset.kind === "image"
      ? asset.dataUrl
      : MediaUtils.localFileUrl(asset.filePath);
  },

  slideMediaOf(asset: MediaAsset): SlideMedia {
    return { kind: asset.kind, url: MediaUtils.urlOf(asset) };
  },
};
