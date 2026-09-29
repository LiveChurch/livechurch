function parts(version: string): number[] {
  return version.split(".").map((part) => Number.parseInt(part, 10) || 0);
}

export const VersionUtils = {
  /** Negative if `a` < `b`, zero if equal, positive if `a` > `b` (`x.y.z` versions). */
  compare(a: string, b: string): number {
    const left = parts(a);
    const right = parts(b);
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const diff = (left[index] ?? 0) - (right[index] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  },

  isNewer(candidate: string, current: string): boolean {
    return VersionUtils.compare(candidate, current) > 0;
  },
};
