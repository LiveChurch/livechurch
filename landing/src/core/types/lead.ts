/** Who asked for the download link (name, email and the desired version). */
export interface DownloadLead {
  name: string;
  email: string;
  platform: string;
  version: string;
}
