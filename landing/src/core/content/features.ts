import type { IconName } from "@/components/ui/iconPaths";

export type FeatureId = "search" | "themes" | "freeSlides" | "calendar" | "bible";
export type MoreFeatureId = "playlist" | "preview" | "projector" | "templates" | "quickEdit" | "colorMode";

/** Structure of each feature; the texts come from `features.<id>` in the language files. */
export interface CoreFeature {
  id: FeatureId;
  cue: string;
  /** File name in `public/screenshots` (without extension). */
  image: string;
  /** Full-width screenshot, below the text, instead of beside it. */
  wide?: boolean;
}

export interface MoreFeature {
  id: MoreFeatureId;
  icon: IconName;
}

export const CORE_FEATURES: readonly CoreFeature[] = [
  { id: "search", cue: "01", image: "search" },
  { id: "themes", cue: "02", image: "themes", wide: true },
  { id: "freeSlides", cue: "03", image: "free-slides" },
  { id: "calendar", cue: "04", image: "calendar" },
  { id: "bible", cue: "05", image: "bible-live" },
];

export const MORE_FEATURES: readonly MoreFeature[] = [
  { id: "playlist", icon: "list" },
  { id: "preview", icon: "eye" },
  { id: "projector", icon: "monitor" },
  { id: "templates", icon: "template" },
  { id: "quickEdit", icon: "pencil" },
  { id: "colorMode", icon: "moon" },
];
