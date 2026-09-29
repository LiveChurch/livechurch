import { RandomUtils } from "@/core/utils/RandomUtils";

/**
 * Snow in depth layers: `depth` 0 is the background (small, faded
 * and slow flake) and 1 is the front (larger, blurred and slightly faster flake).
 * Fixed seed so the snow is the same in all windows and renders.
 */
export interface SnowFlake {
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
  blur: string;
  sway: string;
  swayDuration: string;
}

const FLAKE_COUNT = 60;
const random = RandomUtils.seeded(23);

function createFlake(depth: number): SnowFlake {
  const duration = RandomUtils.between(depth, 18, 9);
  return {
    left: `${RandomUtils.between(random(), 0, 100).toFixed(2)}%`,
    size: `${RandomUtils.between(depth, 1.5, 5.5).toFixed(2)}px`,
    duration: `${duration.toFixed(2)}s`,
    delay: `-${(random() * duration).toFixed(2)}s`,
    opacity: RandomUtils.between(depth, 0.35, 0.9).toFixed(2),
    blur: depth > 0.8 ? "1px" : "0px",
    sway: `${RandomUtils.between(depth, 4, 14).toFixed(1)}px`,
    swayDuration: `${RandomUtils.between(random(), 3, 6).toFixed(2)}s`,
  };
}

/** Sorted from back to front, so the nearby flakes stay on top. */
export const SNOW_FLAKES: SnowFlake[] = RandomUtils.depths(random, FLAKE_COUNT).map(createFlake);
