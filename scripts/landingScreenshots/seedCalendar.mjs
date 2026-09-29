// Seeds the language and recurring events into the app's localStorage (keys used by I18n and calendarStore).
const LOCALE_STORAGE_KEY = "locale";
const CALENDAR_STORAGE_KEY = "calendar_events";

/** Runs inside the page, before the app loads. */
export function seedStorage({ locale, localeKey, calendarKey, weeklyEvents }) {
  const start = new Date();
  start.setDate(start.getDate() - 28);
  const startDate = start.toISOString().slice(0, 10);

  const events = weeklyEvents.map((event, index) => ({
    id: `seed-${index}`,
    title: event.title,
    date: startDate,
    time: event.time,
    recurrence: "weekly",
    weekDays: [event.weekDay],
  }));
  localStorage.setItem(localeKey, locale);
  localStorage.setItem(calendarKey, JSON.stringify(events));
}

export function addStorageSeed(context, { locale, events }) {
  return context.addInitScript(seedStorage, {
    locale,
    localeKey: LOCALE_STORAGE_KEY,
    calendarKey: CALENDAR_STORAGE_KEY,
    weeklyEvents: events,
  });
}
