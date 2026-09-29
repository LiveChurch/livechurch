import type { SlideTemplate } from "@/core/types/playlist";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";
import { TemplateUtils } from "./TemplateUtils";
import {
  PlaylistPersistence,
  TEMPLATE_STORAGE_KEY,
} from "./PlaylistPersistence";
import type { PlaylistState } from "./playlistTypes";

export function createTemplateActions(state: PlaylistState) {
  const persist = PersistenceUtils.debouncePersist(async () => {
    if (!state.isHydrated) return;
    try {
      await PlaylistPersistence.write(
        TEMPLATE_STORAGE_KEY,
        state.slideTemplates,
      );
    } catch (error) {
      console.error("Falha ao persistir templates", error);
    }
  });

  return {
    saveTemplate(name: string, content: string) {
      const template: SlideTemplate = {
        id: `template-${Date.now()}`,
        name,
        content,
        variables: TemplateUtils.extractVariables(content),
        createdAt: Date.now(),
      };
      state.slideTemplates.push(template);
      void persist();
      return template;
    },

    deleteTemplate(templateId: string) {
      state.slideTemplates = state.slideTemplates.filter(
        (t) => t.id !== templateId,
      );
      void persist();
    },

    updateTemplate(templateId: string, name: string, content: string) {
      const template = state.slideTemplates.find((t) => t.id === templateId);
      if (!template) return;
      template.name = name;
      template.content = content;
      template.variables = TemplateUtils.extractVariables(content);
      void persist();
    },

    renderTemplate(
      templateContent: string,
      variables: Record<string, string>,
    ) {
      return TemplateUtils.render(templateContent, variables);
    },

    extractVariables(templateContent: string) {
      return TemplateUtils.extractVariables(templateContent);
    },
  };
}
