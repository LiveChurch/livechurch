import type { BibleVersion, PlaylistItemType, Slide } from "./playlist";
import type { SlidesTheme } from "./theme";

export type NoticePosition = "top" | "bottom";

/** `static`: still, centered text; `marquee`: text scrolling in a loop (TV news ticker style). */
export type NoticeEffect = "static" | "marquee";

export type NoticeMarqueeSpeed = "slow" | "normal" | "fast";

/** One-off notice (e.g. "move your car") overlaid on the on-air slide. */
export interface LiveNotice {
  text: string;
  position: NoticePosition;
  backgroundColor: string;
  textColor: string;
  /** Multiplier of the default font size (1 = 100%). */
  fontScale: number;
  effect: NoticeEffect;
  marqueeSpeed: NoticeMarqueeSpeed;
}

export interface LivePayload {
  slides: Slide[];
  slideIndex: number;
  slide: Slide;
  theme: SlidesTheme;
  itemType: PlaylistItemType;
  bibleVersion: BibleVersion;
  playlistItemId: string;
  backgroundSeed?: string;
  notice?: LiveNotice | null;
}

/** Notice already shown, kept (in memory) to be reapplied. */
export interface NoticeHistoryEntry extends LiveNotice {
  id: string;
}
