export const NumberUtils = {
  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  },
  /** Converts an input value (string | number | null) into a number, with a fallback if invalid. */
  parse(value: string | number | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  },
};
