import { markRaw, shallowReactive, shallowRef } from "vue";
import type { AppLocale } from "../i18n/AppLocale";
import type { BibleBook, BibleVersion } from "../types/playlist";
import { BUNDLED_SOURCES } from "./bibleSources";
import { CustomBibleStore } from "./CustomBibleStore";

const BUNDLED: BibleVersion[] = BUNDLED_SOURCES.map(({ id, locale, name, tag, description }) => ({
  id,
  locale,
  name,
  tag,
  description,
}));

// The text stays outside any reactive state; only the set of loaded ids
// is reactive, so getters/computeds recompute when the download finishes.
const books = new Map<string, BibleBook[]>();
const pending = new Map<string, Promise<BibleBook[]>>();
const loadedIds = shallowReactive(new Set<string>());
const customVersions = shallowRef<BibleVersion[]>([]);

/** Versions imported by the user (metadata only; the text is read from the database when used). */
const ready = CustomBibleStore.loadVersions()
  .then((versions) => {
    customVersions.value = versions;
  })
  .catch((error) => console.error("Falha ao carregar as Bíblias importadas", error));

function allVersions(): BibleVersion[] {
  return [...BUNDLED, ...customVersions.value];
}

function findVersion(versionId: string | undefined): BibleVersion {
  const versions = allVersions();
  return versions.find((version) => version.id === versionId) ?? versions[0];
}

function readText(version: BibleVersion): Promise<{ default: unknown }> {
  if (version.custom) {
    return CustomBibleStore.loadBooks(version.id).then((data) => ({ default: data }));
  }
  const source = BUNDLED_SOURCES.find(({ id }) => id === version.id) ?? BUNDLED_SOURCES[0];
  return source.load();
}

function register(version: BibleVersion, data: BibleBook[]) {
  books.set(version.id, markRaw(data));
  loadedIds.add(version.id);
}

export const BibleVersions = {
  /** Resolves when the imported Bibles have been listed. */
  ready,

  get all(): BibleVersion[] {
    return allVersions();
  },

  find: findVersion,

  /** Suggested version for the language (the first bundled one), if any. */
  defaultFor(locale: AppLocale): BibleVersion | undefined {
    return BUNDLED.find((version) => version.locale === locale);
  },

  /** Loads (only once) the version's text. */
  load(versionId: string): Promise<BibleBook[]> {
    const version = findVersion(versionId);
    const existing = pending.get(version.id);
    if (existing) return existing;

    const request = readText(version).then((module) => {
      const data = module.default as BibleBook[];
      register(version, data);
      return books.get(version.id) as BibleBook[];
    });
    request.catch((error) => {
      pending.delete(version.id);
      console.error(`Falha ao carregar a Bíblia ${version.tag}`, error);
    });
    pending.set(version.id, request);
    return request;
  },

  /**
   * Books of the version, or `null` while they have not been downloaded yet (in that case
   * triggers the download; whoever read inside a computed/getter recomputes when it finishes).
   */
  books(versionId: string): BibleBook[] | null {
    const { id } = findVersion(versionId);
    if (loadedIds.has(id)) return books.get(id) ?? null;
    // The failure is already logged in `load()`; here we only avoid the unhandled rejection.
    BibleVersions.load(id).catch(() => null);
    return null;
  },

  /** Stores a Bible imported by the user and makes it available in the list. */
  async addCustom(details: Omit<BibleVersion, "id" | "custom">, data: BibleBook[]) {
    const version: BibleVersion = { ...details, id: `custom-${crypto.randomUUID()}`, custom: true };
    await CustomBibleStore.save(version, data);
    register(version, data);
    customVersions.value = [...customVersions.value, version];
    return version;
  },

  async removeCustom(versionId: string) {
    await CustomBibleStore.remove(versionId);
    books.delete(versionId);
    pending.delete(versionId);
    loadedIds.delete(versionId);
    customVersions.value = customVersions.value.filter((version) => version.id !== versionId);
  },
};
