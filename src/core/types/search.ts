export type SearchResultType =
  | "song"
  | "bible"
  | "bible-verse"
  | "template-instance"
  | "harpa"
  | "action-calendar";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  data?: SearchResultData;
}

export interface SearchResultData {
  id?: string;
  title?: string;
  artist?: string;
  lyrics?: string;
  slides?: string[];
  number?: string;
  chorus?: string;
  verses?: Record<string, string>;
  book?: string;
  chapter?: string;
  verse?: string;
  range?: string;
  action?: string;
  content?: string;
}

export interface SearchCommand {
  id: string;
  label: string;
  description: string;
  icon: "sparkles" | "template" | "music";
  templateId?: string;
  /** Present in the "create song" commands: name typed in the search. */
  songName?: string;
}
