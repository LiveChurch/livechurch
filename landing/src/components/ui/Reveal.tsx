"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const REVEAL_THRESHOLD = 0.15;

interface RevealProps {
  as?: "div" | "h1" | "p";
  /** Entrance delay, in ms. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Fades in when scrolled to the element (the `reveal`/`is-visible` classes are in animations.css). */
export function Reveal({ as = "div", delay, className = "", children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: REVEAL_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;
  return createElement(as, { ref, className: `reveal ${className}`, style }, children);
}
