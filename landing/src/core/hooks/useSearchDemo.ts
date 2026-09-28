"use client";

import { useEffect, useState } from "react";
import type { SearchDemoItem } from "@/core/content/searchDemo";

export type SearchDemoStage = "typing" | "result" | "live";

const TYPE_DELAY_MS = 90;
const RESULT_DELAY_MS = 900;
const LIVE_DURATION_MS = 3800;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simulates the app's search by typing examples in a loop: type → result → on the screen. */
export function useSearchDemo(items: readonly SearchDemoItem[]) {
  const [itemIndex, setItemIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [stage, setStage] = useState<SearchDemoStage>("typing");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(items[0].query);
      setStage("live");
      return;
    }

    let stopped = false;

    async function typeQuery(query: string) {
      setTyped("");
      setStage("typing");
      for (let length = 1; length <= query.length; length++) {
        if (stopped) return;
        setTyped(query.slice(0, length));
        await wait(TYPE_DELAY_MS);
      }
    }

    async function loop() {
      for (let index = 0; !stopped; index = (index + 1) % items.length) {
        setItemIndex(index);
        await typeQuery(items[index].query);
        if (stopped) return;
        setStage("result");
        await wait(RESULT_DELAY_MS);
        if (stopped) return;
        setStage("live");
        await wait(LIVE_DURATION_MS);
      }
    }

    void loop();
    return () => {
      stopped = true;
    };
  }, [items]);

  return { item: items[itemIndex], typed, stage };
}
