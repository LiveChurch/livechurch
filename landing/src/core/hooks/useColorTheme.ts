"use client";

import { useEffect, useState } from "react";

export type ColorTheme = "dark" | "light";

const STORAGE_KEY = "livechurch-landing-theme";

function persistTheme(theme: ColorTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn("Não foi possível salvar o tema", error);
  }
}

/** The initial theme was already applied to <html> by `public/theme-init.js`; here we only read and toggle it. */
export function useColorTheme() {
  const [theme, setTheme] = useState<ColorTheme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: ColorTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    persistTheme(next);
  }

  return { theme, toggle };
}
