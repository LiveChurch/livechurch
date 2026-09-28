import Dexie, { type Table } from "dexie";
import type { BibleBook, BibleVersion } from "../types/playlist";

interface StoredText {
  id: string;
  books: BibleBook[];
}

/** Database of imported Bibles: metadata and text in separate tables (the text is heavy). */
class CustomBibleDb extends Dexie {
  versions!: Table<BibleVersion, string>;
  texts!: Table<StoredText, string>;

  constructor() {
    super("livechurch_bibles");
    this.version(1).stores({ versions: "id", texts: "id" });
  }
}

const db = new CustomBibleDb();

export const CustomBibleStore = {
  loadVersions(): Promise<BibleVersion[]> {
    return db.versions.toArray();
  },

  async loadBooks(versionId: string): Promise<BibleBook[]> {
    const stored = await db.texts.get(versionId);
    if (!stored) throw new Error(`Texto da Bíblia importada não encontrado: ${versionId}`);
    return stored.books;
  },

  async save(version: BibleVersion, books: BibleBook[]): Promise<void> {
    await db.transaction("rw", db.versions, db.texts, async () => {
      await db.versions.put(version);
      await db.texts.put({ id: version.id, books });
    });
  },

  async remove(versionId: string): Promise<void> {
    await db.transaction("rw", db.versions, db.texts, async () => {
      await db.versions.delete(versionId);
      await db.texts.delete(versionId);
    });
  },
};
