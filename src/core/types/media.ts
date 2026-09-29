export type MediaKind = "image" | "video";

/** Media shown by a slide (image or video, filling the whole frame). */
export interface SlideMedia {
  kind: MediaKind;
  url: string;
}

interface MediaAssetBase {
  id: string;
  name: string;
  createdAt: number;
}

/** Image uploaded by the user, stored whole (data URL) in the library. */
export interface ImageAsset extends MediaAssetBase {
  kind: "image";
  dataUrl: string;
}

/** Video referenced by its path on disk (the file is not copied). */
export interface VideoAsset extends MediaAssetBase {
  kind: "video";
  filePath: string;
}

/** File uploaded by the user and stored in the media library. */
export type MediaAsset = ImageAsset | VideoAsset;
