# CLAUDE.md

# TASK MANAGEMENT: GITHUB ISSUES

Project tasks live as GitHub Issues in this repository, handled through the `gh` CLI. Authentication stays in `gh`'s own configuration, never in this file or in the repository.

## When to use GitHub Issues

**Only use GitHub Issues when the user's message starts with one of these prefixes.** The prefix defines the type of the created issue.

| Prefix       | Issue label |
| ------------ | ----------- |
| `story:`     | `story`     |
| `bug:`       | `bug`       |
| `task:`      | `task`      |

Without one of these prefixes, **do not create or change any issue**: just do what was asked normally.

## Flow with a prefix

1. **For a story (`story:`), ask for approval before creating it**: present the user with the title, the description and the list of proposed subtasks, and only create it after they approve (applying any adjustments they ask for). Bugs and tasks do not need this approval.
2. **Create the issue** with the label matching the prefix, before starting, with a scope description, assigned to the authenticated `gh` user.
3. **For a story, create subtasks** as separate issues labeled `task`, linked as sub-issues of the story, one per step or work area. Bugs and tasks are single issues, with no subtasks.
4. **Do the work**, commenting on progress in each issue.
5. **Ask the user for approval** when done: summarize what was done and ask whether you may commit. Do not commit or close anything without this approval.
6. **Once approved**: make the commit, referencing the issue (e.g. `#123`); close the issue (and the subtasks, if any) with a comment containing the commit hash and **how it was resolved** (cause of the problem or chosen approach, what was changed and in which files, decisions made and pending items, if any).

## Other rules

- New work that comes up during a story becomes a new subtask of it (or a new issue, if out of scope), and does not sneak into an existing issue.
- If `gh` is not installed or authenticated, tell the user instead of working around it with another method.

# CODE CONVENTIONS!!!

## Goal

This project (Vue 3 + Pinia + PrimeVue 4 + Tailwind v4, packaged with Electron) must prioritize clean code that is simple to understand, easy to maintain and easy to evolve.

When implementing any feature, prefer a small, explicit solution with well-separated responsibilities instead of concentrating a lot of logic in a single file or component.

See also `CONVENTIONS.md` (map of existing components, stores, composables and icons). Do not recreate what already exists there.

---

## 1. General code rules

- Write simple, readable code.
- Prefer descriptive names over comments explaining confusing code.
- Avoid premature abstractions.
- Avoid duplicated logic, but do not create generic abstractions just to remove a few lines.
- Each function, composable, class or component must have a single clear responsibility.
- Avoid overly long functions/components.
- Avoid giant files.
- When a file starts to concentrate too many responsibilities, extract parts into appropriate modules/components/composables.
- Do not hide important logic in components that should only handle presentation.
- Avoid `any` when a proper type exists.
- Prefer composition (slots, child components) over components with dozens of conditionals and props.
- Do not write "magic" code that is hard to trace.
- Keep imports, dependencies and responsibilities organized.
- Remove dead code, unused imports and unused abstractions.
- Do not implement features in an improvised way just to "make it work".
- Avoid prop drilling (use a Pinia store, `provide/inject` or slots).
- Similar snippets in components in different places must be turned into a component.
- Files must not exceed 150 lines; always prefer fewer lines.
- ALWAYS USE FLEXBOX, AND AVOID SETTING HEIGHT AND WIDTH.
- File names: PascalCase (classes, components, singleton objects) or camelCase.
- Prefer creating a function grouper instead of several loose functions in the file. E.g. `StringUtils.rename` instead of a standalone `rename` function; this gives context.

### Before implementing

Always think:

1. Does this logic belong in the component?
2. Is it state?
3. Is it reusable logic?
4. Is it a business rule?
5. Is it infrastructure?
6. Is there a mature library to solve this?

The location of the code must reflect its responsibility.

---

# 2. Vue

## Components

- Use SFCs with `<script setup lang="ts">`.
- Vue components must be small and focused.
- A component must not accumulate: complex state, API calls, business rules, data transformation, extensive UI, effect logic and several different behaviors at the same time.
- If a component is getting big, split it into components.
- If a component has a lot of logic, extract it into a composable in the same folder as the component (see section 12).
- Components that represent independent parts of the interface must be extracted.
- Prefer composing components over monolithic components.
- Do not use a component as a "universal container" for several responsibilities.
- Props in camelCase in the script and kebab-case in the template; events via `defineEmits`; `v-model` via `defineModel`.
- ALWAYS use theme tokens for colors (e.g. `primary`, `surface`, `muted-foreground`, defined in `src/style.css`), except for user-defined colors or free-purpose ones.
- ALWAYS use Tailwind's spacing/typography scale (`p-2`, `gap-4`, `text-xs`...). Do not deliberately set height and width.

### Conceptual example

Instead of:

```text
HugePage
 ├── fetches data
 ├── controls form
 ├── controls modal
 ├── renders table
 ├── renders filters
 ├── renders header
 └── contains all the rules
```

Prefer:

```text
HugePage
 ├── Header
 ├── Filters
 ├── Content
 │   ├── Table
 │   └── EmptyState
 └── Modal
```

The page must orchestrate the components, not implement all of their logic.

---

# 3. State: Pinia

## Main rule

**Pinia is used for shared state. Local state uses `ref()`/`reactive()`.**

Use mutability (it is Vue's default). Do not copy objects just to "follow immutability".

### Local state

State used by only one component/page stays in the component itself (or in its composable):

```ts
const value = ref("");
const loading = ref(false);
```

When the state has several related properties and actions, group it with `reactive()` or extract it into a composable.

### Shared state

When state must be used by multiple independent pages/components, use (or create) a Pinia store in `core/state/<context>/`.

```text
core/state/
├── playlist/playlistStore.ts
├── theme/themeStore.ts
└── calendar/calendarStore.ts
```

The existing stores expose `{ state, actions }` (e.g. `useThemeStore().state`, `.actions`). Follow this pattern in new stores.

Do not turn all local state into global state:

- used only in that context → `ref`/`reactive`
- shared across contexts → Pinia store

Use the store directly in the components that need it, instead of passing values through props across several levels. Use `computed` for derived values and `storeToRefs`/`computed` to keep reactivity when destructuring.

---

# 4. Folder architecture

The main structure separates page-specific Vue code, reusable components and code that does not directly depend on Vue.

```text
src/
├── core/          # everything that is not a component
├── pages/         # one folder per page
├── modals/        # modals opened via openModal()
├── components/    # shared components
├── plugins/       # PrimeVue, Pinia etc.
└── ...
```

## `core/`

`core` contains everything that is **not a Vue component (.vue)**, subdivided by context:

```text
core/
├── api/
├── composables/
├── constants/
├── data/
├── services/
├── state/
├── types/
└── utils/
```

Do not put `.vue` files inside `core`. If a new category appears, create a folder consistent with the responsibility instead of putting everything in `utils`.

---

# 5. `pages/`

Each page has its own folder, with `index.vue` (or an equivalent name) and its exclusive components/composables:

```text
pages/Control/
├── Control.vue
├── PlaylistPanel.vue
└── useControlShortcuts.ts
```

If a component/composable is only used by one page, it stays inside that page's folder. Only move it to `components/` when it is really shared by multiple contexts. Do not anticipate reuse.

# 6. `modals/`

Each modal has its own folder (e.g. `modals/TextEditor/TextEditorModal.vue`), uses the `modals/Modal.vue` wrapper and is opened via `openModal()`. Modal callbacks remain function props (see `CONVENTIONS.md`).

# 7. `components/`

Shared components, subdivided by context/domain:

```text
components/
├── ui/          # Select, AppIcon, ContextMenu...
├── playlist/
├── slides/
├── theme-selector/
└── ...
```

### Criteria for deciding where to put something

Is it a Vue component?

- exclusive to a page → `pages/<Page>`
- exclusive to a modal → `modals/<Modal>`
- shared → `components/<context>`

Not a component → `core/<context>`.

---

# 8. Libraries and dependencies

**Before implementing something manually, check whether a mature library solves the problem.** Do not reinvent common functionality.

Current stack (prefer what already exists):

- UI → **PrimeVue 4** (import per file, e.g. `primevue/button`)
- icons → `AppIcon` (Material Icons) and PrimeIcons
- styling → **Tailwind v4** (`cn` from `@/core/utils/ClassNameUtils`)
- state → **Pinia**
- dates → `date-fns`
- utilities → `lodash`
- drag and drop → `vue-draggable-plus`
- local database → `dexie`
- animations → `<Transition>`/`<TransitionGroup>` + CSS

This does not mean installing any library for anything.

## Mandatory decision before adding a new library

When a relevant library exists that is **not yet in the project**, **do not decide silently**. Present the option before implementing and ask the user which approach they prefer:

> Library X exists and solves this. I can: 1. use X; 2. use another library Y; 3. implement from scratch. Which do you prefer?

Briefly explain the trade-offs. Implementing from scratch is acceptable when: the user asks for it; the library does not fit; the dependency is disproportionate; or the implementation is extremely simple.

---

# 9. Componentization

Extract a component when it:

- has its own responsibility;
- has its own state/behavior;
- is visually an independent unit;
- is making the parent hard to understand;
- has complex logic;
- can be reused;
- represents an important domain concept.

Do not componentize just to turn every `div` into a component.

---

# 10. Small files

Small components are preferable; files with multiple responsibilities must be split; business logic leaves the UI when it grows; complex composables are separated; complex stores are separated by domain.

Main question: **does this file still have a clear responsibility and is it still easy to understand?** If not, split it.

---

# 11. Form elements

**Never use native form elements**:

- `<button>` → `Button` (`primevue/button`)
- `<input>` → `InputText` / `InputNumber`
- `<textarea>` → `Textarea`
- `<select>` → `@/components/ui/Select.vue`
- radio/checkbox → `RadioButton` / `Checkbox` with `<label for>` + `input-id`

Exceptions: `<div contenteditable>`, `<img>` and simple `<a>`. Inputs must always have a label (`<label for>` or `aria-label`).

---

# 12. Composables

Composables (`useX`) must have a clear responsibility and return `ref`s/`computed`/functions.

## Component with a lot of logic

Separate the logic into a composable **in the same folder as the component**:

```text
modals/CreatePlaylist/
├── CreatePlaylistModal.vue
└── useCreatePlaylistForm.ts
```

```ts
// useCreatePlaylistForm.ts
export function useCreatePlaylistForm() {
  const name = ref("");
  const canSave = computed(() => name.value.trim().length > 0);
  return { name, canSave };
}
```

The component handles rendering/orchestration; the composable concentrates the behavior. Generic composables live in `core/composables/` (e.g. `useClock`, `useClickOutside`, `useBreakpoint`). Lifecycle effects use `onMounted`/`onUnmounted`; always clean up listeners and timers.

---

# 13. Services and API

Data access (Dexie, Electron/IPC, HTTP) and business rules must not be scattered across the UI. Prefer `core/services/<Domain>Service.ts` (e.g. `LyricsService`, `SearchService`) or `core/api/`. The component consumes a clear abstraction, without knowing implementation details.

---

# 14. Business rules and template

Business rules must not be hidden in the template. When a condition gets complex, extract it into a `computed`, function, service or store.

Keep the template declarative and easy to read. Always use Tailwind for styling (`<style>` only when Tailwind cannot solve it, e.g. `<Transition>` classes). Avoid:

- extensive logic in the template;
- large inline functions;
- multiple levels of ternaries;
- `v-if` and `v-for` on the same element;
- data manipulation directly in rendering (use `computed`).

Always use a stable `:key` in `v-for`.

---

# 15. DRY without excess

Avoid real duplication of logic, but do not create generic abstractions just because two things look similar. Prefer small, clear duplication over a complex generic abstraction.

---

# 16. Typing

Use TypeScript consistently: avoid `any` and casts (`as`) that hide problems; use typed `defineProps<{...}>()`/`defineEmits`; keep types close to the domain (`core/types/`); types must correctly represent the domain, not just satisfy the compiler.

---

# 17. Imports

Use the `@/` → `src/` alias. Keep imports organized, with no circular imports. If the structure produces complex imports between modules, reevaluate the architecture instead of creating more aliases.

---

# 18. Performance

Do not optimize prematurely. Write correct, simple code first. Optimize with evidence (e.g. `computed`, `v-memo`, `shallowRef` for large data, virtualization of long lists). Small components make render control easier.

---

# 19. Accessibility

- Use semantic elements when appropriate (`<a>`, `<label>`...).
- Icon-only buttons need `aria-label`.
- Do not rely on color alone to convey information.
- Interactive components must be usable by keyboard.
- Prefer accessible PrimeVue components.

---

# 20. Error handling

Do not silently ignore errors (no empty `catch {}`). Errors must be handled, propagated, logged or shown to the user. Do not hide problems just to make the flow "work".

---

# 21. Refactoring

When the user requests a **refactoring**, the implementation must actually change the way the code is done.

- Do not keep the old implementation just for compatibility.
- Do not create wrappers/adapters to keep legacy code.
- Do not keep two implementations of the same functionality.
- Remove the old code when it is replaced and adapt the consumers.

**If a refactoring was requested, really change the implementation.**

---

# 22. Before finishing an implementation

- [ ] Does the component have a clear responsibility and is the file small (≤ 150 lines)?
- [ ] Was logic extracted into a composable/service when necessary?
- [ ] Does local state use `ref`/`reactive`, and is shared state in a Pinia store?
- [ ] Is non-Vue code in `core/`, and are exclusive components in the page/modal?
- [ ] No native form elements?
- [ ] Colors via theme tokens, layout with flexbox, no unnecessary width/height?
- [ ] Is there a mature library for something done manually? Was the decision presented to the user?
- [ ] No unnecessary `any`, no unjustified duplication, no premature abstractions?
- [ ] Errors handled correctly and UI easy to understand?

---

# Final principle

**Do not choose the solution that is fastest to write. Choose the solution that is simplest to understand, maintain and evolve.**

When there is a relevant architectural or dependency decision, present the options and let the user decide before implementing.
