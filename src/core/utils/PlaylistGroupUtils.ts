import type { PlaylistItem, PlaylistItemType } from "@/core/types/playlist";
import { I18n } from "@/core/i18n/I18n";

export interface PlaylistGroup {
  id: string;
  label: string;
  items: PlaylistItem[];
}

interface GroupDefinition {
  id: string;
  label: string;
  types: PlaylistItemType[];
}

/** The order here is the order in which the groups appear in the list. */
const GROUP_DEFINITIONS: GroupDefinition[] = [
  { id: "harpa", get label() { return I18n.t("common.terms.harpa"); }, types: ["harpa"] },
  { id: "song", get label() { return I18n.t("core.playlistGroups.songs"); }, types: ["song"] },
  { id: "bible", get label() { return I18n.t("common.terms.bible"); }, types: ["bible", "bible-verse"] },
  { id: "slides", get label() { return I18n.t("control.menu.slides"); }, types: ["template-instance", "free-slides"] },
  { id: "media", get label() { return I18n.t("modals.addToPlaylist.types.mediaLabel"); }, types: ["media"] },
  { id: "countdown", get label() { return I18n.t("modals.addToPlaylist.types.countdownLabel"); }, types: ["countdown"] },
];

export const PlaylistGroupUtils = {
  groupIdOf(item: PlaylistItem): string | undefined {
    return GROUP_DEFINITIONS.find((group) => group.types.includes(item.type))?.id;
  },

  /** Agrupa itens por tipo semelhante, omitindo grupos vazios. */
  group(items: PlaylistItem[]): PlaylistGroup[] {
    return GROUP_DEFINITIONS.map(({ id, label, types }) => ({
      id,
      label,
      items: items.filter((item) => types.includes(item.type)),
    })).filter((group) => group.items.length > 0);
  },
};
