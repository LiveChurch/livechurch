export const JsonUtils = {
  /** Deep copy by serialization; only works for simple JSON data. */
  clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  },
};
