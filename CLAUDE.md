# Agent Guidelines — Hand Notes

This file is read by AI coding assistants working on this repository.
Follow every rule here on every task, no exceptions.

---

## Project identity

**Hand Notes** is a static Astro site for engineering notes. The aesthetic is a warm paper notebook — graph-paper code blocks, handwritten fonts, paginated page cards. Every design decision must serve *readability first*.

---

## Non-negotiable rules

### 1. Read-friendly design always wins

Before writing or editing any content or CSS, ask: *"Does this make the page easier or harder to read?"*

- Body copy lives in `.body-text` — 18 px, `line-height: 2.0`. Never go below 15 px for prose.
- Code blocks are `<pre class="code-block">` — 13.5 px monospace, `line-height: 1.9`. Never squeeze them.
- Content width is `920px` via `--content-width`. Do not add extra `max-width` inside `.page` or `.cover`.
- Prefer one column for code-heavy content. Use `.code-compare` for comparisons, not `.two-col`.

### 2. Always use `<pre>` for code blocks

Every code block **must** be `<pre class="code-block">`, never `<div class="code-block">`.

Astro's HTML minifier collapses newlines between `<span>` elements inside `<div>` elements, rendering all lines on one line. `<pre>` is protected from this by the HTML spec — minifiers must not touch its whitespace.

### 3. Escape braces in the HTML template section

Any `{` or `}` character in the HTML template part of an `.astro` file (everything after the second `---`) must be written as `&#123;` and `&#125;` respectively. Astro parses bare braces as JSX expressions and the build will fail.

This applies only to the template — the frontmatter JavaScript block is unaffected.

### 4. Check the style guide before inventing styles

The `/style-guide` route demonstrates every available component. Use the existing classes. Do not add one-off inline styles for things the design system already covers.

### 5. CSS Grid children need `min-width: 0`

CSS Grid items default to `min-width: auto`, which lets them overflow their column. Any bare `<div>` used as a direct grid child **must** have `min-width: 0` set (either via a class or inline style). Classes that already handle this: `.col-card`, `.cheat-card`, `.scope-side`.

---

## File map (quick reference)

| File | Purpose |
|------|---------|
| `src/styles/tokens.css` | All CSS custom properties — edit here first |
| `src/styles/themes.css` | Theme (`warm`/`cool`/`dark`) and font overrides |
| `src/styles/components.css` | Every component class — source of truth for UI |
| `src/styles/global.css` | Resets + `@import` chain |
| `src/layouts/BaseLayout.astro` | HTML shell, fonts, FOUC script |
| `src/components/PaginationController.astro` | Drop-in paginator for any note |

---

## Adding a new note page

1. Copy `src/pages/notes/spring-boot-ioc.astro` as the template.
2. Escape all `{` → `&#123;` and `}` → `&#125;` in the HTML section.
3. Use `<pre class="code-block [color]-left">` for every code block.
4. Place `<PaginationController />` just before `</BaseLayout>`.
5. Add an entry to the `notes` array in `src/pages/index.astro`.

---

## Component cheat sheet

```
Prose             .body-text
Code block        <pre class="code-block [green|orange|purple|red]-left">
Code comparison   .code-compare > .code-compare-panel
Two-col text      .two-col > .col-card
Cheat grid        .cheat-grid > .cheat-card
Flow diagram      .flow-row > .flow-box.fb-* + .flow-arr
Lifecycle diagram .phase-flow > .phase-box.ph-* + .phase-arrow
Sticky callout    .sticky
Insight box       .insight [.green-ins|.orange-ins]
Bullet list       .note-list > li[.sq|.ck|.cr|.st]
Table             .note-table
Inline highlight  .hl .hl-green .hl-blue .hl-orange .hl-purple
Wavy underline    .wu .wu-o .wu-b
```

---

## Commit style

Short, lowercase, imperative: `add spring-aop note`, `fix code block overflow`, `update content width`.
