import { createApp, vaporInteropPlugin } from "vue";
import { createPinia } from "pinia";

// Fonts: Oxanium (UI) + Material Icons (via AppIcon) + PrimeIcons (structural
// PrimeVue icons: Select/DatePicker arrows, Dialog's X...).
import "@fontsource/oxanium/300.css";
import "@fontsource/oxanium/400.css";
import "@fontsource/oxanium/500.css";
import "@fontsource/oxanium/700.css";
import "@fontsource/material-icons/400.css";
import "primeicons/primeicons.css";

import "./style.css";

import App from "./App.vue";
import { installPrimeVue } from "@/plugins/primevue";
import { i18n } from "@/core/i18n/I18n";

const app = createApp(App);

app.use(vaporInteropPlugin);
app.use(createPinia());
app.use(i18n);
document.documentElement.lang = i18n.global.locale.value;
installPrimeVue(app);

app.mount("#root");
