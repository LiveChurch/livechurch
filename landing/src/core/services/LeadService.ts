import type { DownloadLead } from "@/core/types/lead";

export const LeadService = {
  /** Records who asked for the download link (saving to the database happens in /api/leads). */
  async register(lead: DownloadLead): Promise<void> {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`/api/leads respondeu ${response.status}: ${await response.text()}`);
    }
  },
};
