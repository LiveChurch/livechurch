import type { App } from "vue";
import PrimeVue from "primevue/config";
import Ripple from "primevue/ripple";
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import type { PrimeVueConfiguration } from "primevue/config";
import { watch } from "vue";
import { I18n, i18n } from "@/core/i18n/I18n";
import { PrimeVueLocale } from "./primeVueLocale";

/**
 * App surface palette mapped onto the Aura tokens.
 *
 * The values point to the `--app-*` variables declared in `style.css`
 * (`:root`/`.light-mode` and `.dark-mode`), which switch on their own with the
 * UI theme. WATCH OUT for polarity: in Aura's LIGHT scheme the numbers go up from
 * light to dark (0 = white, 950 = almost black); in the DARK scheme it is the
 * opposite in the CONSUMERS (e.g. `text.color = {surface.0}`,
 * `content.background = {surface.900}`, `formField.background =
 * {surface.950}`) — so the dark map below must put the LIGHT colors
 * at the LOW numbers and the dark ones at the HIGH, mirroring Aura's real zinc.
 */
const lightSurface = {
  "0": "var(--app-surface)", // panels
  "50": "var(--app-background)",
  "100": "var(--app-background)",
  "200": "var(--app-border)",
  "300": "var(--app-border)",
  "400": "var(--app-muted-foreground)",
  "500": "var(--app-muted)",
  "600": "var(--app-surface-foreground)",
  "700": "var(--app-surface-foreground)",
  "800": "var(--app-foreground)",
  "900": "var(--app-foreground)",
  "950": "var(--app-foreground)",
};

const darkSurface = {
  "0": "var(--app-foreground)", // #f4f4f5 — text/icon over a dark background
  "50": "var(--app-surface-foreground)", // #e4e4e7
  "100": "var(--app-surface-foreground)",
  "200": "var(--app-muted)", // #d4d4d8
  "300": "var(--app-muted-foreground)", // #a1a1aa
  "400": "var(--app-muted-foreground)", // placeholders/icons
  "500": "var(--app-border)", // #3f3f46 (hover borders)
  "600": "var(--app-border)", // field borders
  "700": "var(--app-surface-light)",
  "800": "var(--app-surface)", // #27272a (list item hover)
  "900": "var(--app-background)", // #18181b (content/overlays)
  "950": "var(--app-background)", // input background
};

/** App brand (#fa6100) on the Aura scale (50..950). */
const primaryPalette = {
  "50": "#fff4ed",
  "100": "#ffe5d3",
  "200": "#ffc7a6",
  "300": "#ffa26d",
  "400": "#fb7a33",
  "500": "#fa6100",
  "600": "#e05800",
  "700": "#bd4203",
  "800": "#94360b",
  "900": "#772c0c",
  "950": "#401504",
};

/** Form fields/overlays matched to the app tokens in both themes. */
const formFieldTokens = {
  background: "var(--app-surface)",
  disableBackground: "var(--app-surface-light)",
  border: "var(--app-border)",
  hoverBorder: "var(--app-border)",
  errorBorder: "var(--app-danger)",
  focusBorder: "var(--app-primary)",
  filledFocusBorder: "var(--app-primary)",
};

/**
 * Menu items (Menu, TieredMenu, ContextMenu...): the item background on
 * hover/focus/active stands out from the panel (`--app-surface`) and the icons light up.
 */
const navigationTokens = {
  item: {
    focusBackground: "var(--app-surface-light)",
    activeBackground: "var(--app-surface-light)",
    color: "var(--app-surface-foreground)",
    focusColor: "var(--app-foreground)",
    activeColor: "var(--app-foreground)",
    icon: {
      color: "var(--app-muted-foreground)",
      focusColor: "var(--app-foreground)",
    },
  },
};

export const livePreset = definePreset(Aura, {
  semantic: {
    primary: primaryPalette,
    colorScheme: {
      light: {
        surface: lightSurface,
        formField: formFieldTokens,
        navigation: navigationTokens,
        overlay: {
          select: { background: "var(--app-surface)" },
          popover: { background: "var(--app-surface)" },
          modal: { background: "var(--app-surface)" },
        },
      },
      dark: {
        surface: darkSurface,
        formField: formFieldTokens,
        navigation: navigationTokens,
        overlay: {
          select: { background: "var(--app-surface)" },
          popover: { background: "var(--app-surface)" },
          modal: { background: "var(--app-surface)" },
        },
      },
    },
  },
});

/**
 * Single PrimeVue configuration. Install it ONCE, in the main app: each
 * installation recompiles the whole theme and reinjects the CSS of all components
 * (that is why the `openModal` modals run inside the app, via `ModalHost`).
 *
 * `cssLayer`: the CSS injected by the theme lives in the `primevue` layer, declared in
 * `style.css` BEFORE `utilities` — so the components' Tailwind classes
 * always win over Aura's default style (same scheme as existed with
 * Quasar wrapped in `@layer quasar`).
 */
const primeVueOptions: PrimeVueConfiguration = {
  ripple: false,
  locale: PrimeVueLocale.of(I18n.locale),
  theme: {
    preset: livePreset,
    options: {
      darkModeSelector: ".dark-mode",
      cssLayer: {
        name: "primevue",
        order: "theme, base, components, primevue, primevue-variants, utilities",
      },
    },
  },
};

export function installPrimeVue(app: App): void {
  app.use(PrimeVue, primeVueOptions);
  const config = app.config.globalProperties.$primevue.config;
  watch(
    () => i18n.global.locale.value,
    () => (config.locale = PrimeVueLocale.of(I18n.locale)),
  );
  app.directive("ripple", Ripple);
}
