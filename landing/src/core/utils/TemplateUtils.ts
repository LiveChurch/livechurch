export const TemplateUtils = {
  /** Troca `{nome}` pelos valores informados (`fill("v{version}", { version: "1.0" })` → `v1.0`). */
  fill(template: string, values: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder);
  },
};
