/** Site subpath (e.g. `/livechurch` on GitHub Pages); empty in development. Set by NEXT_PUBLIC_BASE_PATH at build time. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const BasePathUtils = {
  /** Prefixes a root-relative path (`/logo.png`) with the site subpath. Needed for plain `<img>`, `<a>` and CSS urls; `next/link` already does it. */
  url(path: string): string {
    return `${BASE_PATH}${path}`;
  },
};
