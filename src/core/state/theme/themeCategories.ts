import type { PlaylistItemType } from "@/core/types/playlist";
import type { DefaultThemeCategory, SlidesTheme } from "@/core/types/theme";
import { I18n } from "@/core/i18n/I18n";
import { useLanguageStore } from "@/core/state/language/languageStore";

const CATEGORY_BY_ITEM_TYPE: Partial<
  Record<PlaylistItemType, DefaultThemeCategory>
> = {
  bible: "bible",
  "bible-verse": "bible",
  harpa: "harpa",
  song: "hymns",
  "template-instance": "events",
  countdown: "events",
};

const ALL_OPTIONS = [
  { value: "bible", get label() { return I18n.t("common.terms.bible"); } },
  { value: "harpa", get label() { return I18n.t("common.terms.harpa"); } },
  { value: "hymns", get label() { return I18n.t("core.themeCategories.hymns"); } },
  { value: "events", get label() { return I18n.t("core.themeCategories.events"); } },
] satisfies { value: DefaultThemeCategory; label: string }[];

export const ThemeCategories = {
  /** The Harpa category is only offered in the languages that have the Harpa. */
  get options() {
    const { supportsHarpa } = useLanguageStore().state;
    return ALL_OPTIONS.filter((option) => option.value !== "harpa" || supportsHarpa);
  },

  forItemType(itemType: PlaylistItemType): DefaultThemeCategory | undefined {
    return CATEGORY_BY_ITEM_TYPE[itemType];
  },

  /** A theme without categories is offered to all; without a target category, any theme works. */
  appliesTo(theme: SlidesTheme, category?: DefaultThemeCategory): boolean {
    if (!category) return true;
    const categories = theme.categories ?? [];
    return categories.length === 0 || categories.includes(category);
  },
};
