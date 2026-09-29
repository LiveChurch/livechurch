export const RandomUtils = {
  /**
   * Deterministic pseudo-random generator (mulberry32): the same seed always
   * generates the same sequence, useful for visual effects that cannot change on every render.
   */
  seeded(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  /**
   * `count` depths from 0 (back) to 1 (front), sorted from back to front
   * and with more items at the back, like in a real scene (used for rain/snow).
   */
  depths(random: () => number, count: number): number[] {
    return Array.from({ length: count }, () => random() ** 1.6).sort((a, b) => a - b);
  },

  /** Number between `min` and `max` from a value from 0 to 1. */
  between(random: number, min: number, max: number): number {
    return min + random * (max - min);
  },
};
