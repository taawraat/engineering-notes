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
Cover card        .cover
                    .cover-subject  ← series label, small caps
                    h1              ← single sentence, NO <br /> tags
                    .cover-sub      ← one subtitle line
                    .cover-tags     ← .tag.tag-g/b/o/p chips
                    .cover-doodle   ← decorative emoji
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

### Rule 6 — Mobile-first thinking for every component

The site is read heavily on phones. Follow these rules for every new component or content block:

**Breakpoints** (all in `components.css` responsive section):
- `≤ 768px` — tablet: tighten padding
- `≤ 640px` — mobile: major changes (single-column, smaller text, compact UI)
- `≤ 480px` — small phones: fine-tuning (hide decorative elements, shrink further)

**Component rules:**
- Never use hard pixel widths on layout elements — use `max-width` + `width: 100%`.
- New multi-column grids **must** be added to the `≤ 640px` block with `grid-template-columns: 1fr`.
- New tables **must** get `display: block; overflow-x: auto; -webkit-overflow-scrolling: touch` at `≤ 640px`.
- Code blocks already handle themselves — `overflow-x: auto` + `white-space: pre` scroll natively.
- Decorative-only elements (`.cover-doodle`, `.section-num`, `.pg-hint`, `.cover-subject`) are hidden at small breakpoints. New decorative elements must follow this pattern.
- The pagination bar is 54px on mobile and 64px on desktop. Fixed elements must use `body.pg-mode` to adjust their `bottom` above the bar.

**Two known mobile-specific fixes baked into the CSS:**

1. **`.page-num` is hidden at `≤ 640px`** — the badge (`position: absolute; top: 16px; right: 24px`) overlaps the section header when page top-padding is reduced. The pagination bar already shows the page number, so hiding it is correct. Never remove this rule.

2. **`.section-title` has `flex: 1; min-width: 0`** — this lets the title text wrap inside the flex row on narrow screens. Without it, long titles like "1. Inversion of Control (IoC)" overflow their column. Every flex-row text element needs this treatment.

3. **`.sticky` has `transform: none` at `≤ 640px`** — the slight rotation is charming on desktop but causes content to clip at screen edges on mobile.

4. **Swipe-nav vs. horizontal scroll conflict** — `PaginationController` guards against this. On every `touchstart` it records the target element; on `touchend` it walks the DOM to check for any ancestor with `overflow-x: auto|scroll` AND `scrollWidth > clientWidth`. If found, the swipe is for scrolling and page navigation is skipped. **Never remove the `isInsideHScrollable` guard.** Any new element with `overflow-x: auto` is protected automatically — no extra code needed.

### Cover writing rule

The `h1` inside `.cover` must be a single flowing sentence — **no `<br />` tags**. The font is 34 px and will wrap naturally. Forced line breaks produce an oversized, theatrical heading that pushes reading content far down the page.

---

## Commit style

Short, lowercase, imperative: `add spring-aop note`, `fix code block overflow`, `update content width`.
