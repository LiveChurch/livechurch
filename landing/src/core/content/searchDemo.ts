import type { IconName } from "@/components/ui/iconPaths";

/** Example of the app's search; the texts come from `demo.items` in the language files. */
export interface SearchDemoItem {
  query: string;
  icon: IconName;
  resultTitle: string;
  resultSubtitle: string;
  slideReference: string;
  slideText: string;
  slideFooter?: string;
}
