// Per-language data the screenshots depend on: search queries (the app matches book names of the
// language's default Bible), texts typed in the free slides and the seeded calendar events.
// `hymn` only exists in pt-BR, the only language with the Harpa Cristã.
export const LOCALE_SETUPS = [
  {
    locale: "pt-BR",
    bible: { query: "isaias 5:6", title: "Isaías 5" },
    psalmQuery: "salmos 23",
    hymn: { query: "chuvas de graça", title: "1 - Chuvas de Graça" },
    freeSlides: {
      name: "Avisos da semana",
      text: "Escola Bíblica\nQuarta-feira, 19h30\n\nCulto de Ceia\nDomingo, 18h\n\nTraga um irmão\nvisitante para o culto",
    },
    events: [
      { title: "Culto de Celebração", time: "18:00", weekDay: 0 },
      { title: "Estudo Bíblico", time: "19:30", weekDay: 3 },
      { title: "Culto de Oração", time: "19:30", weekDay: 5 },
    ],
  },
  {
    locale: "en",
    bible: { query: "isaiah 5:6", title: "Isaiah 5" },
    psalmQuery: "psalms 23",
    freeSlides: {
      name: "Weekly announcements",
      text: "Bible School\nWednesday, 7:30 PM\n\nCommunion Service\nSunday, 6 PM\n\nBring a friend\nto the service",
    },
    events: [
      { title: "Celebration Service", time: "18:00", weekDay: 0 },
      { title: "Bible Study", time: "19:30", weekDay: 3 },
      { title: "Prayer Service", time: "19:30", weekDay: 5 },
    ],
  },
  {
    locale: "es",
    bible: { query: "isaias 5:6", title: "Isaías 5" },
    psalmQuery: "salmos 23",
    freeSlides: {
      name: "Avisos de la semana",
      text: "Escuela Bíblica\nMiércoles, 19:30\n\nCulto de Santa Cena\nDomingo, 18:00\n\nTrae a un amigo\nal culto",
    },
    events: [
      { title: "Culto de Celebración", time: "18:00", weekDay: 0 },
      { title: "Estudio bíblico", time: "19:30", weekDay: 3 },
      { title: "Culto de Oración", time: "19:30", weekDay: 5 },
    ],
  },
];
