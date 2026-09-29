import { I18n } from "@/core/i18n/I18n";
export interface UnsplashPhoto {
  url: string;
  alt: string;
}

interface UnsplashApiPhoto {
  alt_description?: string | null;
  urls: { regular: string };
}

export const UnsplashService = {
  missingClientIdMessage:
    "Unsplash Client ID não configurado. Configure VITE_UNSPLASH_CLIENT_ID em .env.local",

  hasClientId() {
    return Boolean(import.meta.env.VITE_UNSPLASH_CLIENT_ID);
  },

  async search(query: string): Promise<UnsplashPhoto[]> {
    const clientId = import.meta.env.VITE_UNSPLASH_CLIENT_ID;
    if (!clientId) {
      throw new Error(UnsplashService.missingClientIdMessage);
    }
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "6");
    url.searchParams.set("client_id", clientId);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Unsplash respondeu ${response.status}`);
    }
    const data = (await response.json()) as { results?: UnsplashApiPhoto[] };

    return (data.results ?? []).map((photo) => ({
      url: photo.urls.regular,
      alt: photo.alt_description || I18n.t("core.unsplash.imageAlt"),
    }));
  },

  readImageFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },
};
