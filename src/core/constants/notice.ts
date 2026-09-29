import type { LiveNotice, NoticeMarqueeSpeed } from "@/core/types/live";

export const DEFAULT_NOTICE: LiveNotice = {
  text: "",
  position: "bottom",
  backgroundColor: "#000000",
  textColor: "#ffffff",
  fontScale: 1,
  effect: "static",
  marqueeSpeed: "normal",
};

export const NOTICE_MAX_LENGTH = 140;

export const NOTICE_FONT_SCALE = { min: 0.5, max: 2.5, step: 0.1 };

/** Seconds the ticker takes to cross one screen width. */
export const NOTICE_MARQUEE_SECONDS_PER_SCREEN: Record<NoticeMarqueeSpeed, number> = {
  slow: 14,
  normal: 9,
  fast: 5,
};
