import path from "node:path";

const ADD_ATTEMPTS = 5;
const RETRY_WAIT_MS = 3000;

/**
 * App steps that generate each screenshot, in the language given by `labels` and `setup`.
 * `suffix` distinguishes the theme (e.g. "-light").
 */
export class Capture {
  constructor(page, { outputDir, suffix, labels, setup }) {
    this.page = page;
    this.outputDir = outputDir;
    this.suffix = suffix;
    this.labels = labels;
    this.setup = setup;
  }

  pause(ms = 900) {
    return this.page.waitForTimeout(ms);
  }

  async shot(name) {
    await this.page.screenshot({ path: path.join(this.outputDir, `${name}${this.suffix}.png`) });
    console.log(`✔ ${this.labels.locale}/${name}${this.suffix}.png`);
  }

  searchBox() {
    return this.page.getByLabel(this.labels.t("control.search.label"));
  }

  /**
   * Adds the first search result. When `expectedTitle` is given, retries until that item shows up in the
   * playlist: the Bible of the language is still loading (and being suggested by the app) at the start.
   */
  async addToPlaylist(query, expectedTitle) {
    const search = this.searchBox();
    for (let attempt = 0; attempt < ADD_ATTEMPTS; attempt++) {
      await search.fill(query);
      await this.pause(1200);
      await this.page.keyboard.press("Enter");
      await this.pause();
      if (!expectedTitle || (await this.page.getByText(expectedTitle).count()) > 0) return;
      await search.fill("");
      await this.pause(RETRY_WAIT_MS);
    }
    throw new Error(`"${expectedTitle}" did not show up in the playlist after searching "${query}"`);
  }

  async searchOpen() {
    const search = this.searchBox();
    await search.fill(this.setup.psalmQuery);
    await this.pause();
    await this.shot("search");
    await search.fill("");
    await this.page.keyboard.press("Escape");
  }

  async goLive(playlistItem, name) {
    await this.page.getByText(playlistItem).first().click();
    await this.pause(1200);
    await this.page.getByLabel(this.labels.t("control.centerPanel.showOnScreen")).click();
    await this.pause(1200);
    await this.shot(name);
  }

  async freeSlides() {
    await this.page.getByLabel(this.labels.t("control.playlist.addToPlaylist")).click();
    await this.pause();
    await this.page.getByText(this.labels.t("modals.addToPlaylist.types.freeSlidesLabel")).first().click();
    await this.page.getByPlaceholder(this.labels.t("components.itemForm.nameExample")).fill(this.setup.freeSlides.name);
    await this.page
      .getByPlaceholder(this.labels.t("components.slidesEditor.placeholder"))
      .fill(this.setup.freeSlides.text);
    await this.pause(1200);
    await this.shot("free-slides");
    await this.page.getByRole("button", { name: this.labels.t("common.actions.cancel") }).click();
    await this.pause();
  }

  async calendar() {
    await this.page.getByLabel(this.labels.t("control.statusBar.openCalendar")).click();
    await this.pause(1200);
    await this.shot("calendar");
    await this.page.getByLabel(this.labels.t("modals.calendar.closeCalendar")).click();
    await this.pause();
  }

  async themes() {
    await this.page.getByLabel(this.labels.t("control.statusBar.openGlobalThemes")).click();
    await this.pause(1200);
    const dialog = this.page.locator(".p-dialog").last();
    await dialog.getByText(this.labels.t("components.themeSelector.sections.background"), { exact: true }).click();
    await this.pause();
    await dialog.getByText(this.labels.t("core.backgrounds.mountainsName")).first().click();
    await this.pause();
    await this.shot("themes");
  }
}
