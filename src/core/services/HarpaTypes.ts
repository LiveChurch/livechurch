export interface HarpaEntry {
  hino?: string;
  coro?: string;
  verses: Record<string, string>;
}

export interface HarpaSong {
  number: string;
  title: string;
  chorus?: string;
  verses: Record<string, string>;
  slides: string[];
}

export type HarpaData = Record<string, HarpaEntry>;
