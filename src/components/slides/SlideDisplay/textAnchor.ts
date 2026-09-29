import type { CSSProperties } from "vue";
import type { TextAnchor } from "@/core/types/theme";

/** Vertical position of the text within the slide's usable area, according to the theme's anchor. */
export const TEXT_ANCHOR_POSITION: Record<TextAnchor, CSSProperties> = {
  top: { top: 0 },
  center: { top: "50%", transform: "translateY(-50%)" },
  bottom: { bottom: 0 },
};
