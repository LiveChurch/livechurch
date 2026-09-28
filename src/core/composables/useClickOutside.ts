import { onScopeDispose, watch } from "vue";
import type { Ref } from "vue";

/**
 * Fires `onOutsideClick` when a click happens outside the `elRef` element.
 * Replaces React's useClickOutside hook.
 */
export function useClickOutside(
  elRef: Ref<HTMLElement | null | undefined>,
  onOutsideClick: () => void,
  active: Ref<boolean> | boolean = true,
) {
  const handleClick = (event: MouseEvent) => {
    if (elRef.value && !elRef.value.contains(event.target as Node)) {
      onOutsideClick();
    }
  };

  let attached = false;
  const attach = () => {
    if (attached) return;
    document.addEventListener("mousedown", handleClick);
    attached = true;
  };
  const detach = () => {
    if (!attached) return;
    document.removeEventListener("mousedown", handleClick);
    attached = false;
  };

  if (typeof active === "boolean") {
    if (active) attach();
  } else {
    watch(active, (value) => (value ? attach() : detach()), {
      immediate: true,
    });
  }

  onScopeDispose(detach);
}
