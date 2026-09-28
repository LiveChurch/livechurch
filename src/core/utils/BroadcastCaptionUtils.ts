import type { BroadcastStyle } from "@/core/types/broadcast";
import type { LiveContent } from "@/core/types/playlist";

function isBible(source: LiveContent) {
  return source.itemType === "bible" || source.itemType === "bible-verse";
}

export const BroadcastCaptionUtils = {
  /**
   * Whether there is something to caption: something on air, caption on and a text slide
   * (media and countdown slides do not become captions).
   */
  hasCaption(source: LiveContent | null | undefined, style: BroadcastStyle): source is LiveContent {
    if (!source || !style.visible) return false;
    const { slide } = source;
    return !slide.media && !slide.countdown && slide.text.trim() !== "";
  },

  /** Bible reference (e.g. "John 3:16 · NIV"), or `null` outside the Bible or if turned off. */
  reference(source: LiveContent, style: BroadcastStyle): string | null {
    if (!style.showReference || !isBible(source) || !source.slide.title) return null;
    return `${source.slide.title} · ${source.bibleVersion.tag}`;
  },
};
