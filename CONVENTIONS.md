# App conventions (Vue 3)

Conversion of the React app (MobX + react-aria/UntitledUI/shadcn + framer-motion + lucide) to
**Vue 3 + Pinia + PrimeVue 4 + Tailwind v4**. Read this before creating any file.

## General

- Naming convention: **singleton objects in PascalCase** (e.g. `BrowserDesktopApi`),
  instances/functions follow camelCase; types/interfaces PascalCase; constants in SCREAMING_SNAKE.
- **Never use native form elements**: `<button>` → `Button` (primevue/button),
  `<input>` → `InputText` (primevue/inputtext), `<textarea>` → `Textarea` (primevue/textarea),
  `<select>` → wrapper `@/components/ui/Select.vue` (on top of PrimeVue's `Select`),
  radio/checkbox → PrimeVue's `RadioButton`/`Checkbox` (manual label with `<label for>` +
  `input-id`, since the components have no `label` prop in v4). Exceptions:
  `<div contenteditable>` (no equivalent) and simple `<img>`/`<a>`.
- SFC with `<script setup lang="ts">`. Layout/style composition: **keep the Tailwind classes**
  from the React original (the tokens `bg-surface`, `text-brand`, `border-border`,
  `bg-media`, `text-muted-foreground` etc. exist in `src/style.css`).
- UI language: pt-BR (same texts/aria as the React app).
- Imports use the `@/` → `src/` alias (e.g. `@/core/types/playlist`).
- `cn` comes from `@/core/utils/ClassNameUtils` (clsx + tailwind-merge, same as React).
- No `observer`: Vue templates are already reactive.
- `useLocalObservable` (ephemeral local state) → `ref()`/`reactive()` in the component.
- Props: camelCase in the script, kebab-case in the template. `emit` events for callbacks that
  React passed as `onX` props, EXCEPT in modals (see Modals below), where the callback
  remains a function prop (`onClose`) because ModalHost injects it via `v-bind`.

## Pinia stores (already created — do NOT recreate)

The API mirrors MobX's `{ state, actions }` so it can be ported mechanically:

```ts
import { useThemeStore } from "@/core/state/theme/themeStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";

const themeCtx = useThemeStore(); // themeCtx.state.themes / themeCtx.actions.setUiTheme(...)
const playlistCtx = usePlaylistStore();
const calendarCtx = useCalendarStore();
```

Mapping: `const { state, actions } = usePlaylist()` (React) → `playlistCtx.state`/
`playlistCtx.actions` (Vue). The context effects/reactions already live in the stores.

## Composables (already created)

`@/core/composables/useClock|useClickOutside|useMonitors|useLivePayload|useWindowControls|useSearch|useBreakpoint`
They return `ref`s — in the Vue template the unwrap is automatic; in JS use `.value`.
`useClickOutside(elRef, cb, activeRef)` — elRef is a `Ref<HTMLElement|null>` (template ref).

## Icons (replace lucide-react)

Material Icons via `<AppIcon name="..." size="..."/>` (`@/components/ui/AppIcon.vue`).
Semantic map in `@/core/constants/icons.ts` (`APP_ICONS`), resolved by the `app` prefix:
use `name="app~search"`, `app~music`, `app~book` etc. to keep the parallel with the React code.
Structural PrimeVue icons (Select arrows, DatePicker calendar, Dialog X)
come from the PrimeIcons font (`primeicons`) automatically.

## UI: React base/UntitledUI → PrimeVue 4

Do NOT port `src/components/base/*`, `application/date-picker/*` or `foundations/*`.
PrimeVue components are **imported per file** (e.g. `import Button from "primevue/button"`).
The theme is the custom `livePreset` preset (`@/plugins/primevue.ts`, based on Aura with the
app's `--app-*` tokens); Tailwind utility classes live in a cascade layer AFTER
`primevue`, so they always win over the component's default style.

| React                     | Vue/PrimeVue |
|---------------------------|--------------|
| `<Button variant color size>` | `<Button :label variant="text" severity="secondary" @click>` + tailwind classes for adjustments; icon: `#icon` slot with `<AppIcon/>` |
| `<Input>` (base/input)    | PrimeVue's `InputText`/`Textarea` — NEVER a native `<input>` |
| app `<Select>` (`@/components/ui/Select.vue`) | `Select.vue` wrapper built on PrimeVue's `Select` (API: `options: {label,value}[]`, `modelValue`, `emit update:modelValue`) |
| RadioGroup/RadioGroupItem | `RadioButton` + manual `<label for>` (`input-id`; v4 has no `label` prop) |
| Checkbox                  | `Checkbox :binary="true"` + manual `<label for>` |
| Tooltip                   | PrimeVue's `<Hint>`/`Tooltip` (or native title, as in the original) |
| Date range picker (react-day-picker) | `DatePicker selection-mode="range"` (model `Date[]`); single date: `DatePicker :readonly="true" show-icon` (model `Date`) |
| react-hook-form           | `ref()` of values + manual validation (keep pt-BR messages); do not add new libs |
| Portal/contextmenu        | `@/components/ui/ContextMenu.vue` (+ `ContextMenuItem.vue`), with `v-model` + `x/y` |
| framer-motion             | Vue's `<Transition>`/`<transition-group>` + CSS (transition classes) or pure CSS animations depending on the effect |
| AnimatePresence (slide fade) | `<Transition name="fade">` with CSS `opacity` |
| `useEffect(... keydown)` | `onMounted`/`onUnmounted` with `document.addEventListener` |

## Principle: use what Vue/PrimeVue already do

Do NOT mechanically port what React reimplemented: modals → PrimeVue's `Dialog` (`Modal.vue`
shell or `openModal` service), selection/inputs/radios/checkbox → `InputText`/`Textarea`/
`Select`/`RadioButton`/`Checkbox`, date range → `DatePicker selection-mode="range"`,
context menus → `ContextMenu.vue` (portaled, from the codebase itself), presence/transition →
`<Transition>`. Resizable panel → `ResizablePanel.vue` (copied from React; save the
width in localStorage with `watch`).

## Modals (openModal service — replaces Quasar's Dialog plugin)

Each modal is an SFC displayed programmatically:

```ts
import TextEditorModal from "@/modals/TextEditor/TextEditorModal.vue";
import { openModal } from "@/modals/openModal";

openModal(TextEditorModal, { itemId, onSave: (text: string) => ... });
```

- The modal's props are the 2nd argument of `openModal` (replaces `componentProps`).
- The `Modal.vue` shell (on top of PrimeVue's `Dialog`) exposes `hide()`; close with
  `const modalRef = ref<InstanceType<typeof Modal>|null>(null); modalRef.value?.hide()` —
  never `emit('close')`. `Modal.vue` injects `MODAL_HANDLE` and notifies the service when the
  Dialog finishes hiding (X/ESC/click-outside), which removes the modal from the `modal` store.
- `openModal` only registers the modal in the `modal` store (`core/state/modal`); what renders
  it is `ModalHost.vue`, mounted in `App.vue`, inside the main app. Never create another app
  (`createApp`) nor reinstall PrimeVue for a modal: that recompiles the entire theme.
- Confirmations: helper `src/modals/Alert.ts` with the SAME API as the React
  `Alert.show({title, message, confirmText, isDestructive}): Promise<boolean>`, implemented
  with `openModal(ConfirmModal, {...})` + `onDismiss`.
- Nested dialogs/controlled by local state (e.g. EventFormModal inside
  CalendarModal) use `<Dialog>` directly in the SFC with `v-model:visible`; whatever is mounted
  by `openModal` also injects `MODAL_HANDLE` and calls `handle.onHidden()` on `@after-hide`
  (the case of CalendarModal, which does not use the `Modal.vue` shell).

## Agreed paths between modules (create exactly at these paths)

- `src/components/slides/SlideDisplay/SlideDisplay.vue` (+ SlideBackground.vue,
  EmberLayer.vue, FadeSlide.vue, BottomToUpSlides.vue, SlidePreviewList.vue,
  useSlideVisuals.ts, useSlideFrame.ts alongside)
- `src/components/theme-selector/` (ThemeToolbar.vue, ThemeSectionContent.vue,
  BackgroundSection.vue, FontSection.vue, GradientSection.vue, TransitionSection.vue,
  EffectsSection.vue, ThemeItem.vue, constants.ts, ThemeEditorContext.ts →
  `useThemeEditor.ts` with provide/inject)
- `src/components/shared/ResizablePanel.vue`
- `src/components/ui/` (ContextMenu.vue + ContextMenuItem.vue, Select.vue,
  SlidesList.vue, useSlidesListNavigation.ts, ThemeSectionPanel.vue, Input.vue)
- `src/pages/Control/` (ControlWindow.vue, TitleBar.vue, Header.vue,
  LeftSidebar/{LeftSidebar.vue,PlaylistList.vue,PlaylistItemRow.vue,PlaylistsManager.vue},
  CenterPanel/{CenterPanel.vue,OutputPane.vue,useCenterPanelTheme.ts,useCenterPanelLive.ts,themeSelection.ts},
  StatusBar/{StatusBar.vue,ClockDate.vue,BibleVersionMenu.vue,MonitorMenu.vue,MonitorOption.vue},
  SearchBar/{SearchBar.vue,SearchInput.vue,SearchDropdown.vue,useSearchSelection.ts,commands.ts,actions.ts})
- `src/pages/Projector/ProjectorPage.vue`,
  `src/pages/MonitorIdentify/MonitorIdentifyPage.vue`
- `src/modals/` — one PascalCase folder per modal, with the main component and its
  subcomponents/hooks inside it (e.g. `Calendar/{CalendarModal.vue,CalendarGrid.vue,...}`,
  `GlobalThemes/{GlobalThemesModal.vue,Sidebar.vue,...}`, `Confirm/ConfirmModal.vue`).
  Only the shared infrastructure stays at the root: `Modal.vue`, `ModalHost.vue`,
  `ModalOutlet.vue`, `openModal.ts`, `Alert.ts`.
- Services/types/constants/data: ALREADY EXIST in `src/core/*` (copied). Do not modify
  the JSONs. If a service needs a fine adjustment, copy+edit with a comment.

## Quality

- No unnecessary `any`; strict TypeScript (vue-tsc runs at the end).
- Keep stable keys in `v-for` (`:key="item.id"`).
- Do not import anything from `react*`/`mobx*`/`@tanstack`.
- `window.desktop` is already typed by `@/core/services/DesktopService`.
