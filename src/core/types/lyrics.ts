export interface LyricsTrack {
  trackId: string | number;
  trackName: string;
  artistName: string;
  lyrics: string;
}

export interface LyricsSearchResponse {
  data?: LyricsTrack[];
}
