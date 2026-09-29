"use client";

import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import type { SearchDemoItem } from "@/core/content/searchDemo";
import { useSearchDemo } from "@/core/hooks/useSearchDemo";
import { useI18n } from "@/core/i18n/I18nProvider";

/** Illustrates the app's search, with the examples (verse, schedule...) in the page's language. */
export function HeroSearchDemo() {
  const { t, tm } = useI18n();
  const items = useMemo(() => tm<SearchDemoItem[]>("demo.items"), [tm]);
  const { item, typed, stage } = useSearchDemo(items);

  return (
    <div
      className="flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-edge bg-surface/90 p-3 shadow-2xl shadow-black/40"
      role="img"
      aria-label={t("demo.ariaLabel")}
    >
      <div className="flex items-center gap-2.5 rounded-lg border border-edge bg-page/70 px-3 py-2.5">
        <Icon name="search" size={18} className="text-dim" />
        <span className="font-mono text-sm">
          {typed}
          <span className="caret text-accent">▍</span>
        </span>
      </div>

      <div className="flex min-h-14 flex-col">
        {stage !== "typing" && (
          <div className="flex items-center gap-3 rounded-lg bg-ember px-3 py-2.5 text-soot">
            <Icon name={item.icon} size={20} />
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-sm font-semibold">{item.resultTitle}</span>
              <span className="text-xs opacity-80">{item.resultSubtitle}</span>
            </div>
            <kbd className="rounded bg-soot/20 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
          </div>
        )}
      </div>

      {/* The screen is always dark, in both page themes */}
      <div className="@container relative overflow-hidden rounded-lg bg-black text-chalk">
        <div className="flex aspect-video flex-col items-center justify-center gap-[2cqi] p-[6cqi] text-center">
          {stage === "live" ? (
            <>
              <span className="font-mono text-[2.2cqi] uppercase tracking-[0.3em] text-chalk/70">
                {item.slideReference}
              </span>
              <p className="whitespace-pre-line font-display text-[4.6cqi] leading-tight">{item.slideText}</p>
              {item.slideFooter && (
                <span className="font-mono text-[1.8cqi] uppercase tracking-[0.25em] text-chalk/70">
                  {item.slideFooter}
                </span>
              )}
            </>
          ) : (
            <span className="text-[3cqi] text-chalk/60">{t("demo.nothingLive")}</span>
          )}
        </div>
        <span
          className={`absolute left-3 top-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
            stage === "live" ? "text-ember" : "text-chalk/60"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {stage === "live" ? t("demo.live") : t("demo.waiting")}
        </span>
      </div>
    </div>
  );
}
