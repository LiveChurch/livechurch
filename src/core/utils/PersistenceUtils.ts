import { debounce } from "lodash";

/** Default delay to group persistence writes triggered by reactive changes. */
export const PERSIST_DEBOUNCE_MS = 1000;

export const PersistenceUtils = {
  /** lodash's `debounce` with the app's default persistence delay. */
  debouncePersist<T extends (...args: never[]) => unknown>(fn: T) {
    return debounce(fn, PERSIST_DEBOUNCE_MS);
  },
};
