export interface BugAttachment {
  id: string;
  name: string;
  dataUrl: string;
}

export interface BugReport {
  title: string;
  description: string;
  steps: string;
  images: BugAttachment[];
}

export const BUG_REPORT_LIMITS = {
  title: 100,
  description: 1500,
  steps: 1000,
  images: 5,
} as const;

export const BugReportService = {
  /** No destination configured yet: the report is discarded. */
  async send(_report: BugReport): Promise<void> {},
};
