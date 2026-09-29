import type { AppLocale } from "../i18n/AppLocale";
import type { SlideMedia } from "./media";
import type { SlidesTheme, ThemeBinding } from "./theme";

export type PlaylistItemType =
  | "song"
  | "template-instance"
  | "harpa"
  | "bible"
  | "bible-verse"
  | "free-slides"
  | "media"
  | "countdown";

/** How each digit of the countdown changes value. */
export type CountdownTransition = "none" | "fade" | "roll-up" | "roll-down";

/** What happens on air when the countdown ends. */
export type CountdownFinishAction = "none" | "next-item" | "waiting-screen";

/** Countdown shown in place of the slide text. */
export interface SlideCountdown {
  /** Event time today, in "HH:mm" format. */
  time: string;
  /** Digit transition every second; without a value, the change is instant. */
  transition?: CountdownTransition;
  /** Text shown above the clock. */
  textBefore?: string;
  /** Text shown below the clock. */
  textAfter?: string;
  /** Text shown in place of the clock when time runs out. */
  finalMessage?: string;
  /** For how many seconds the final message stays on air before the automatic actions. */
  finalMessageSeconds?: number;
  /** What to put on air at zero; without a value, the countdown stays stopped at zero. */
  finishAction?: CountdownFinishAction;
  /** At zero, removes the item from the playlist. */
  removeWhenDone?: boolean;
}

export interface Slide {
  title: string;
  text: string;
  media?: SlideMedia;
  countdown?: SlideCountdown;
}

export interface BibleVersion {
  id: string;
  /** Bible imported by the user (kept in the local database, not in the app package). */
  custom?: boolean;
  /** Language of the Bible text. */
  locale: AppLocale;
  name: string;
  tag: string;
  description: string;
}

export interface BibleBook {
  name: string;
  abbrev: string;
  chapters: string[][];
}

export interface PlaylistItem {
  id: string;
  name: string;
  type: PlaylistItemType;
  slides: Slide[];
  activeSlideIndex: number;
  themeBinding?: ThemeBinding | null;
  /** Draw, saved with the item, that pins which background of the background rotation it uses. */
  backgroundSeed?: string;
  /**
   * The item's custom theme, independent of the currently active binding:
   * kept here even when the item is using a global theme, so
   * the user can always go back to it without losing the edits.
   */
  customTheme?: SlidesTheme | null;
  subtitle?: string;
  /** Saved item that mirrors this item: edits made here are also written to it. */
  savedItemId?: string;
  bibleData?: {
    book?: string;
    chapter?: string;
    verse?: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
}

export interface SlideTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  createdAt: number;
}

export interface LiveContent {
  slides: Slide[];
  slideIndex: number;
  slide: Slide;
  theme: SlidesTheme;
  itemType: PlaylistItemType;
  bibleVersion: BibleVersion;
  playlistItemId: string | null;
  /** Draw that chooses the background from the theme's background rotation. */
  backgroundSeed?: string;
}

/** Media slide shown on air when nothing else is playing. */
export interface PlaylistBackground {
  itemId: string;
  slideIndex: number;
}

export interface PersistedPlaylistState {
  playlists: Playlist[];
  activePlaylistId: string;
  activeItemId: string | null;
  liveItemId: string | null;
  liveContent: LiveContent | null;
  background?: PlaylistBackground | null;
  bibleVersionId: string;
  projectorMonitorId: string | null;
}
