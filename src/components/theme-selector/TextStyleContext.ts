import { inject, provide, type InjectionKey } from "vue";
import type { TextStyleFields } from "@/core/types/theme";

/**
 * Text style object that the editor's text components change:
 * the theme itself (Text tab) or the `titleStyle` (Title tab). It is a getter to
 * follow the change of the theme being edited.
 */
const TextStyleKey: InjectionKey<() => TextStyleFields> = Symbol("TextStyle");

export function provideTextStyle(source: () => TextStyleFields) {
  provide(TextStyleKey, source);
}

export function useTextStyle(): () => TextStyleFields {
  const source = inject(TextStyleKey, null);
  if (!source) throw new Error("useTextStyle deve ser usado dentro de provideTextStyle()");
  return source;
}
