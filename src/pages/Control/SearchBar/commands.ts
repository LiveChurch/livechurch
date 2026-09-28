import type { SlideTemplate } from "@/core/types/playlist";
import type { SearchCommand } from "@/core/types/search";
import { I18n } from "@/core/i18n/I18n";

const CREATE_PREFIXES = ["criar", "create", "crear"];

/** Action always available at the end of the search: create a song with the searched term. */
export function buildSongCommands(query: string): SearchCommand[] {
  const songName = query.trim();
  if (!songName) return [];

  return [
    {
      id: "create-song",
      label: I18n.t("control.search.createSong", { name: songName }),
      description: I18n.t("control.search.createSongDescription"),
      icon: "music",
      songName,
    },
  ];
}

/**
 * Special search commands (port of `SearchBar/commands.ts`):
 * they appear when the query starts with "criar".
 */
export function buildTemplateCommands(
  query: string,
  templates: SlideTemplate[],
): SearchCommand[] {
  const typed = query.toLowerCase();
  if (!CREATE_PREFIXES.some((prefix) => typed.startsWith(prefix))) return [];

  return [
    {
      id: "create-template",
      label: I18n.t("control.search.createTemplate"),
      description: I18n.t("control.search.createTemplateDescription"),
      icon: "sparkles",
    },
    ...templates.map((template) => ({
      id: `use-template-${template.id}`,
      label: I18n.t("control.search.createFromTemplate", { name: template.name }),
      description: I18n.t("control.search.useTemplate", { name: template.name }),
      icon: "template" as const,
      templateId: template.id,
    })),
  ];
}
