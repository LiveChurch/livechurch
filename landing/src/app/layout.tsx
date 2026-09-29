import type { ReactNode } from "react";

/** The <html> lives in [locale]/layout.tsx, so the `lang` attribute follows the page's language. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
