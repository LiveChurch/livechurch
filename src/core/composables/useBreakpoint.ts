import { onScopeDispose, ref, type Ref } from "vue";

export type BreakpointSize = "sm" | "md" | "lg" | "xl" | "2xl";

const screens: Record<BreakpointSize, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/**
 * Checks whether a Tailwind breakpoint applies to the current viewport.
 * Replaces React's useBreakpoint hook.
 */
export function useBreakpoint(size: BreakpointSize): Ref<boolean> {
  const query = window.matchMedia(`(min-width: ${screens[size]})`);
  const matches = ref(query.matches);

  const onChange = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };

  query.addEventListener("change", onChange);
  onScopeDispose(() => query.removeEventListener("change", onChange));

  return matches;
}
