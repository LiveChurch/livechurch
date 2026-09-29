import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { TimeUtils } from "@/core/utils/TimeUtils";
import { useClock } from "./useClock";

/** Text of the countdown to today's "HH:mm" time, updated every second. */
export function useCountdown(time: MaybeRefOrGetter<string>) {
  const { now } = useClock(1000);

  const secondsLeft = computed(() => TimeUtils.secondsUntil(toValue(time), now.value));
  const label = computed(() => TimeUtils.formatCountdown(secondsLeft.value));
  const isFinished = computed(() => secondsLeft.value === 0);

  return { label, isFinished };
}
