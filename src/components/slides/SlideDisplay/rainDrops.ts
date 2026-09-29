import { RandomUtils } from "@/core/utils/RandomUtils";

/**
 * Rain in depth layers (parallax): `depth` 0 is the background (thin, faded
 * and slow drop) and 1 is the front (thick, sharp, blurred and faster drop).
 * The seed is fixed so the rain is the same in all windows and renders.
 */
export interface RainDrop {
  left: string;
  width: string;
  length: string;
  duration: string;
  delay: string;
  opacity: string;
  blur: string;
}

export interface RainSplash {
  left: string;
  bottom: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
}

const DROP_COUNT = 70;
const SPLASH_COUNT = 14;
const random = RandomUtils.seeded(7);

function createDrop(depth: number): RainDrop {
  const duration = RandomUtils.between(depth, 4.2, 2.2);
  return {
    left: `${RandomUtils.between(random(), 0, 100).toFixed(2)}%`,
    width: `${RandomUtils.between(depth, 0.8, 2.6).toFixed(2)}px`,
    length: `${RandomUtils.between(depth, 2, 7).toFixed(1)}%`,
    duration: `${duration.toFixed(2)}s`,
    delay: `-${(random() * duration).toFixed(2)}s`,
    opacity: RandomUtils.between(depth, 0.15, 0.6).toFixed(2),
    blur: depth > 0.8 ? "1px" : "0px",
  };
}

function createSplash(depth: number): RainSplash {
  const duration = RandomUtils.between(random(), 2.4, 4);
  return {
    left: `${RandomUtils.between(random(), 4, 96).toFixed(2)}%`,
    bottom: `${RandomUtils.between(depth, 14, 2).toFixed(1)}%`,
    size: `${RandomUtils.between(depth, 1.5, 4).toFixed(2)}%`,
    duration: `${duration.toFixed(2)}s`,
    delay: `-${(random() * duration).toFixed(2)}s`,
    opacity: RandomUtils.between(depth, 0.25, 0.6).toFixed(2),
  };
}

/** Sorted from back to front, so the nearby drops stay on top. */
export const RAIN_DROPS: RainDrop[] = RandomUtils.depths(random, DROP_COUNT).map(createDrop);

export const RAIN_SPLASHES: RainSplash[] = RandomUtils.depths(random, SPLASH_COUNT).map(createSplash);
