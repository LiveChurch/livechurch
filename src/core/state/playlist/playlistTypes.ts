import type {
  LiveContent,
  Playlist,
  PlaylistItem,
  PlaylistBackground,
  PlaylistItemType,
  Slide,
  SlideTemplate,
} from "@/core/types/playlist";
import type { LiveNotice } from "@/core/types/live";
import type { ThemeBinding } from "@/core/types/theme";
import type { ThemePanelSection } from "@/components/theme-selector/sections";
import type { BibleVersion } from "@/core/types/playlist";
import { I18n } from "@/core/i18n/I18n";

export interface PlaylistState {
  playlists: Playlist[];
  slideTemplates: SlideTemplate[];
  activePlaylistId: string;
  activeItemId: string | null;
  liveContent: LiveContent | null;
  liveItemId: string | null;
  /** Broadcast frozen on the current slide: slide changes do not reach the projector. */
  livePaused: boolean;
  /** Media slide shown on air when nothing else is playing. */
  background: PlaylistBackground | null;
  /** Notice overlaid on the on-air slide; not persisted. */
  notice: LiveNotice | null;
  activeThemePanelSection: ThemePanelSection | null;
  bibleVersionId: string;
  projectorMonitorId: string | null;
  isHydrated: boolean;
  activePlaylist: Playlist;
  playlist: PlaylistItem[];
  activeItem: PlaylistItem | undefined;
  activeSlideIndex: number;
  /** The previewed slide is exactly what is on air. */
  isPreviewLive: boolean;
  /** The previewed item is on air following the slides, so it can be paused. */
  canPauseLive: boolean;
  /** There is an item on air, found in some playlist, that is not yet the previewed slide. */
  canFocusLive: boolean;
  /** What is on air is already the background (that is, nothing else is playing). */
  isLiveBackground: boolean;
  /** The previewed slide is the background. */
  isPreviewBackground: boolean;
  /** There is something on air that is not the background, so it can be stopped. */
  canStopLive: boolean;
  slides: Slide[];
  bibleVersions: BibleVersion[];
  activeBibleVersion: BibleVersion;
  canGoToPreviousChapter: boolean;
  canGoToNextChapter: boolean;
}

export type ResolveDefaultThemeBinding = (
  itemType: PlaylistItemType,
) => ThemeBinding | null;

export const DEFAULT_PLAYLIST: Playlist = {
  id: "default",
  name: I18n.t("core.playlist.mainPlaylist"),
  items: [],
};
