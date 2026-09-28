import type { BibleVersion } from "../types/playlist";

export interface BibleVersionSource extends BibleVersion {
  load: () => Promise<{ default: unknown }>;
}

// Each Bible (~4 MB) becomes its own chunk, downloaded only when used.
export const BUNDLED_SOURCES: BibleVersionSource[] = [
  {
    id: "ar",
    name: "Almeida Recebida",
    locale: "pt-BR",
    tag: "AR",
    description: "Tradução do Textus Receptus (almeidarecebida.org).",
    load: () => import("./bibles/pt-BR/ar.json"),
  },
    {
    id: "blivre",
    name: "Bíblia Livre",
    locale: "pt-BR",
    tag: "BLIVRE",
    description: "Tradução moderna em português atual (CC BY 3.0 BR, Bíblia Livre).",
    load: () => import("./bibles/pt-BR/blivre.json"),
  },
 
   {
    id: "arc",
    name: "Almeida Revista e Corrigida (1911)",
    locale: "pt-BR",
    tag: "ARC",
    description: "Almeida Revista e Corrigida de 1911, em domínio público.",
    load: () => import("./bibles/pt-BR/arc.json"),
  },
  {
    id: "kjv",
    name: "King James Version",
    locale: "en",
    tag: "KJV",
    description: "Classic English translation, public domain.",
    load: () => import("./bibles/en/kjv.json"),
  },
  {
    id: "web",
    name: "World English Bible",
    locale: "en",
    tag: "WEB",
    description: "Modern English translation, public domain.",
    load: () => import("./bibles/en/web.json"),
  },
  {
    id: "asv",
    name: "American Standard Version",
    locale: "en",
    tag: "ASV",
    description: "Literal English translation (1901), public domain.",
    load: () => import("./bibles/en/asv.json"),
  },
  {
    id: "rv",
    name: "Reina-Valera 1909",
    locale: "es",
    tag: "RV1909",
    description: "La traducción clásica en español, de dominio público.",
    load: () => import("./bibles/es/rv.json"),
  },
  {
    id: "bes",
    name: "Biblia en Español Sencillo",
    locale: "es",
    tag: "BES",
    description: "Español sencillo y claro (CC BY 4.0, AudioBiblia.org).",
    load: () => import("./bibles/es/bes.json"),
  },
  {
    id: "vbl",
    name: "Versión Biblia Libre",
    locale: "es",
    tag: "VBL",
    description: "Traducción libre en español (CC BY-SA 4.0).",
    load: () => import("./bibles/es/vbl.json"),
  },
];
