// Generates the landing screenshots from the real app (web mode), in each language and in the dark and light themes.
// Usage: bun run landing:screenshots [pt-BR en es]   (run after any visual change in the app)
// Output: landing/public/screenshots/<language>/<name>[-light].png
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";
import { AppLabels } from "./AppLabels.mjs";
import { Capture } from "./Capture.mjs";
import { LOCALE_SETUPS } from "./LocaleSetups.mjs";
import { addStorageSeed } from "./seedCalendar.mjs";

const SCREENSHOTS_DIR = path.join(process.cwd(), "landing", "public", "screenshots");
const VIEWPORT = { width: 1600, height: 1000 };
const SERVER_PORT = 5199;
const BROWSER_CHANNELS = ["msedge", "chrome"];
const AGENDA_QUERY = "agenda";
const APP_START_MS = 3000;

async function launchBrowser() {
  for (const channel of BROWSER_CHANNELS) {
    try {
      return await chromium.launch({ channel });
    } catch {
      console.warn(`Browser "${channel}" unavailable, trying the next one...`);
    }
  }
  throw new Error("No browser (Edge/Chrome) found to capture the screenshots.");
}

async function capturePass(browser, setup, { light }) {
  const labels = new AppLabels(setup.locale);
  const context = await browser.newContext({ viewport: VIEWPORT });
  await addStorageSeed(context, setup);
  const page = await context.newPage();
  await page.goto(`http://localhost:${SERVER_PORT}/`);
  await page.waitForTimeout(APP_START_MS);

  if (light) {
    await page.getByLabel(labels.t("control.header.useLightTheme")).click();
    await page.waitForTimeout(600);
  }

  const outputDir = path.join(SCREENSHOTS_DIR, setup.locale);
  await mkdir(outputDir, { recursive: true });
  const capture = new Capture(page, { outputDir, suffix: light ? "-light" : "", labels, setup });

  const agendaTitle = labels.t("core.agenda.weeklyAgenda");
  await capture.addToPlaylist(setup.bible.query, setup.bible.title);
  await capture.addToPlaylist(setup.psalmQuery);
  if (setup.hymn) await capture.addToPlaylist(setup.hymn.query, setup.hymn.title);
  await capture.addToPlaylist(AGENDA_QUERY, agendaTitle);
  await capture.searchOpen();
  await capture.freeSlides();
  await capture.calendar();
  await capture.goLive(agendaTitle, "agenda-live");
  if (setup.hymn) await capture.goLive(setup.hymn.title, "harpa-live");
  await capture.goLive(setup.bible.title, "bible-live");
  await capture.themes();
  await context.close();
}

function selectedSetups() {
  const requested = process.argv.slice(2);
  if (requested.length === 0) return LOCALE_SETUPS;
  const setups = LOCALE_SETUPS.filter((setup) => requested.includes(setup.locale));
  if (setups.length === 0) {
    throw new Error(`Unknown language. Available: ${LOCALE_SETUPS.map((setup) => setup.locale).join(", ")}`);
  }
  return setups;
}

async function main() {
  const setups = selectedSetups();
  const server = await createServer({ server: { port: SERVER_PORT, strictPort: true } });
  await server.listen();
  const browser = await launchBrowser();

  try {
    for (const setup of setups) {
      await capturePass(browser, setup, { light: false });
      await capturePass(browser, setup, { light: true });
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
