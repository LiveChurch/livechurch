import { StringUtils } from "@/core/utils/StringUtils";
import type { Slide } from "@/core/types/playlist";

const VARIABLE_PATTERN = /#\(([^)]+)\)/g;

export const TemplateUtils = {
  extractVariables(templateContent: string): string[] {
    const variables: string[] = [];
    let match: RegExpExecArray | null;
    VARIABLE_PATTERN.lastIndex = 0;
    while ((match = VARIABLE_PATTERN.exec(templateContent)) !== null) {
      variables.push(match[1]);
    }
    return [...new Set(variables)];
  },

  render(templateContent: string, variables: Record<string, string>): string {
    return Object.entries(variables).reduce(
      (result, [key, value]) =>
        result.replace(new RegExp(`#\\(${key}\\)`, "g"), value),
      templateContent,
    );
  },

  textToSlides(fullText: string, title: string): Slide[] {
    const blocks = StringUtils.splitStanzas(fullText);
    const safeBlocks = blocks.length > 0 ? blocks : [fullText.trim()];
    return safeBlocks.map((text) => ({ text, title }));
  },
};
