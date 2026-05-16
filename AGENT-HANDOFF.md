# Hand Notes — Full Agent Handoff Context

## Project

**Path:** `/home/tawraat/engineering-notes`
**Framework:** Astro v5 (static output)
**Deploy target:** Netlify — https://hand-notes.netlify.app
**Status:** Git repo, working local development

### Commands
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

---

## File Tree

```
/
├── .gitignore
├── README.md                 # developer guide
├── CLAUDE.md                 # AI agent rules — READ THIS FIRST
├── netlify.toml              # build: npm run build, publish: dist, NODE=20
├── astro.config.mjs          # output:'static', site:'https://hand-notes.netlify.app'
├── tsconfig.json
├── package.json              # astro@^5.7.0
├── public/favicon.svg
└── src/
    ├── styles/
    │   ├── tokens.css        # all CSS custom properties
    │   ├── themes.css        # [data-theme="cool/dark"] + [data-font="*"] overrides
    │   ├── components.css    # every component class + all responsive rules
    │   └── global.css        # resets, lined-paper body bg, @imports
    ├── layouts/
    │   └── BaseLayout.astro  # HTML shell, Google Fonts, FOUC script, viewport meta
    ├── components/
    │   ├── SiteNav.astro
    │   ├── ThemeFontPanel.astro
    │   └── PaginationController.astro  # handles all note pagination
    └── pages/
        ├── index.astro               # notes listing (hardcoded array)
        ├── style-guide.astro         # design system showcase + dev rules
        └── notes/
            ├── spring-boot-ioc.astro       # 10-page note
            ├── database-acid.astro         # 10-page note (created this session)
            └── spring-transactional.astro  # 12-page note (created this session)
```

---

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `index.astro` | Notes listing, hardcoded array |
| `/notes/spring-boot-ioc/` | `notes/spring-boot-ioc.astro` | 10 pages, paginated |
| `/notes/database-acid/` | `notes/database-acid.astro` | 10 pages, paginated |
| `/notes/spring-transactional/` | `notes/spring-transactional.astro` | 12 pages, paginated |
| `/style-guide/` | `style-guide.astro` | Design system + mobile rules |

---

## CSS Architecture

```
global.css
  @import tokens.css       ← :root variables
  @import themes.css       ← theme/font overrides
  @import components.css   ← all components + responsive
```

### Key CSS Variables (`tokens.css`)

```css
:root {
  --font-body: 'Klee One', cursive;
  --font-hand: 'Gochi Hand', cursive;
  --font-mono: 'JetBrains Mono', monospace;

  --paper: #fdf8f0;   --paper2: #fef9f2;
  --ink: #2d2318;     --ink2: #4a3728;    --ink3: #6b5040;
  --body-bg: #e8e0d0; --rule-line: #e8dcc8; --grid: #f0e8d8;

  --green: #3a7d4a;   --green-bg: #e8f5ec;  --green-light: #c8e6cf;
  --blue: #2a5fa5;    --blue-bg: #e6eef8;   --blue-light: #b8d0f0;
  --orange: #c45e1a;  --orange-bg: #fdf0e4; --orange-light: #f5cfaa;
  --red: #b53030;     --red-bg: #fdeaea;
  --purple: #6a3d9a;  --purple-bg: #f3eefb;
  --yellow-hl: #fff3a3; --yellow-sticky: #fff176;
  --shadow: rgba(80,50,20,0.10); --shadow2: rgba(80,50,20,0.18);

  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --content-width: 920px;
}
```

---

## Theme & Font Switching

- **Themes:** `warm` (default) · `cool` · `dark` — via `data-theme` on `<html>`
- **Fonts:** `klee` (default) · `caveat` · `patrick` · `kalam` — via `data-font` on `<html>`
- Persisted in `localStorage` (`hn-theme`, `hn-font`)
- FOUC prevented by inline `<script>` in `<head>` of `BaseLayout.astro`
- All 5 font families preloaded in one Google Fonts `<link>`
- Theme panel: floating 🎨 button fixed bottom-right → `ThemeFontPanel.astro`
- When pagination is active (`body.pg-mode`), the panel lifts above the pagination bar

---

## Non-Negotiable Development Rules

### 1. Use `<pre>` for ALL code blocks — never `<div>`

```html
<pre class="code-block [green|orange|purple|red]-left">
  <span class="kw">public class</span> <span class="cl">Foo</span> &#123; &#125;
</pre>
```

**Why:** Astro's HTML minifier collapses newlines between `<span>` elements inside `<div>`, rendering all code on one line. `<pre>` is protected by the HTML spec — minifiers cannot touch its whitespace.

### 2. Escape braces in `.astro` HTML template sections

Every `{` → `&#123;` and `}` → `&#125;` in the HTML template (everything after the second `---`). The frontmatter JS block is unaffected.

This prevents Astro from parsing them as JSX expressions (causes build errors).

### 3. Cover `h1` — no `<br />` tags

Write as a single sentence. The font is 34px and wraps naturally. Forced line breaks create an oversized theatrical heading.

### 4. Check the style guide before adding any new styles

`/style-guide` demonstrates every component. Do not invent one-off inline styles.

### 5. CSS Grid children need `min-width: 0`

Grid items default to `min-width: auto`, which lets them overflow. Any bare `<div>` as a direct grid child needs `min-width: 0`. Classes that already handle this: `.col-card`, `.cheat-card`, `.scope-side`, `.two-col > *`.

### 6. Mobile-first thinking for every new component

Three breakpoints in `components.css` responsive section:

| Breakpoint | Target | Key changes |
|---|---|---|
| `≤ 768px` | Tablet | Tighter padding, smaller cover h1 |
| `≤ 640px` | Phone | 1-col grids, page-num hidden, cover compact, sticky rotation off |
| `≤ 480px` | Small phone | Further reduction, pagination title hidden, nav compact |

### 7. Convert ASCII diagrams to visual components

Never use ASCII art inside code blocks for diagrams. Always use proper visual components:
- `.flow-row` + `.flow-box` for horizontal flows
- `.phase-flow` + `.phase-box` for vertical step flows
- `.two-col` + `.col-card` for side-by-side comparisons
- `.diag-wrap` wrapper for graph-paper background

---

## Pagination System (`PaginationController.astro`)

- Finds all `.page` elements inside `.content-wrap` (`.cover` is untouched)
- Hides all except the current page (`display: none`)
- Adds `body.pg-mode` → `padding-bottom: 72px` for bar clearance
- Fixed bottom bar: ← / → circular buttons, page counter "pg 03 / 10", section title, dot indicators
- Green progress bar fixed at `top: 52px` (below sticky nav)
- Navigation: buttons, dots, keyboard (`←` = prev, `→` = next), horizontal swipe ≥ 60px
- **Keyboard:** Only left/right arrows change pages. Up/down arrows scroll normally (fixed this session)
- Swipe guard: skips navigation if swipe started inside horizontally scrollable element
- Animations: Web Animations API, slide left/right, respects `prefers-reduced-motion`
- URL hash: `#page-3` via `history.replaceState` — restored on page load

### Adding pagination to a new note

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PaginationController from '../../components/PaginationController.astro';
---

<BaseLayout title="..." description="...">
  <div class="cover">...</div>
  <div class="page green-spine">...</div>
  <!-- more .page divs -->
  <PaginationController />
</BaseLayout>
```

---

## Adding a New Note Page (Checklist)

1. Copy `src/pages/notes/spring-boot-ioc.astro` as template
2. Replace ALL `{` with `&#123;` and `}` with `&#125;` in the HTML section (after second `---`)
3. Use `<pre class="code-block">` for every code block (never `<div>`)
4. Write cover `h1` as a single sentence with no `<br />` tags
5. Add `<PaginationController />` before `</BaseLayout>`
6. Register the note in the `notes` array in `src/pages/index.astro`
7. Convert any ASCII diagrams to proper visual components (flow-row, phase-flow, two-col, etc.)

---

## Component Classes Reference

```
Cover card        .cover
                    .cover-subject  ← series label, small caps
                    h1              ← single sentence, NO <br />
                    .cover-sub      ← one subtitle line
                    .cover-tags     ← .tag.tag-g/b/o/p chips
                    .cover-doodle   ← decorative emoji

Page card         .page [.green|blue|orange|purple|red-spine]
Page section hdr  .section-header > .section-icon + .section-title + .section-num
Page number       .page-num (hidden ≤ 640px)
Subsection hdgs   h2.sub · h3.sub

Prose             .body-text (18px / line-height 2.0)
Inline code       <code>
Code block        <pre class="code-block [color]-left">
                    Syntax: .kw .an .cl .st .cm .ar
Code comparison   .code-compare > .code-compare-panel
                    .code-compare-label [.g|.r|.b]
                    .code-compare-sep
                    .code-compare-note

Two-col text      .two-col > .col-card
                    .col-card-title [.g|.r|.b|.o]
Cheat grid        .cheat-grid > .cheat-card
Scope diagram     .scope-diagram > .scope-side
Flow diagram      .flow-row > .flow-box.fb-[gray|blue|green|purple|orange] + .flow-arr
Lifecycle flow    .phase-flow > .phase-box.ph-[gray|blue|green|orange|purple|red] + .phase-arrow
Diagram wrap      .diag-wrap (graph paper bg, overflow-x: auto)

Sticky callout    .sticky (.sticky-label + <p>)
Insight box       .insight [.green-ins|.orange-ins]

Bullet list       .note-list > li [.sq|.ck|.cr|.st]
Table             .note-table
Tags              .tag [.tag-g|.tag-b|.tag-o|.tag-p]

Inline highlight  .hl .hl-green .hl-blue .hl-orange .hl-purple
Wavy underline    .wu (green) .wu-o (orange) .wu-b (blue)
Margin note       .margin-note
```

---

## Code Block Syntax Highlighting Classes

```
.kw  → keyword (public, class, if, return, etc.)
.an  → annotation (@Service, @Transactional, etc.)
.cl  → class name (BankService, String, etc.)
.st  → string literal ("hello", numbers)
.cm  → comment (// comment)
.ar  → arrow/operator (→, =, etc.)
```

---

## Current Notes in index.astro

```javascript
const notes = [
  {
    href:   '/notes/spring-transactional/',
    series: 'Spring Boot · Deep Dive Series',
    title:  '@Transactional — Complete Deep Dive',
    desc:   'Everything about @Transactional: AOP proxy internals, propagation types, isolation levels, rollback rules, common pitfalls, and real-world patterns.',
    tags:   [
      { label: '🔄 Propagation',   cls: 'tag-g' },
      { label: '🔒 Isolation',     cls: 'tag-b' },
      { label: '🛡️ AOP Proxy',    cls: 'tag-o' },
      { label: '⚡ Rollback',      cls: 'tag-p' },
    ],
    doodle: '🔁',
    pages:  12,
  },
  {
    href:   '/notes/database-acid/',
    series: 'Database Fundamentals · Deep Dive Series',
    title:  'ACID Properties & Transaction Guarantees',
    desc:   'Complete deep dive into ACID — Atomicity, Consistency, Isolation, Durability. Covers MySQL internals, isolation levels, MVCC, anomalies, and interview prep.',
    tags:   [
      { label: '⚛️ Atomicity',     cls: 'tag-g' },
      { label: '🔒 Isolation',     cls: 'tag-o' },
      { label: '🔄 MVCC',          cls: 'tag-b' },
      { label: '📝 Undo/Redo',     cls: 'tag-p' },
    ],
    doodle: '🗄️',
    pages:  10,
  },
  {
    href:   '/notes/spring-boot-ioc/',
    series: 'Spring Boot · Deep Dive Series',
    title:  'IoC Container, @Bean & Dep. Injection',
    desc:   'How Spring actually works under the hood — BeanDefinition, CGLIB proxies, DI types, scopes, lifecycle, and circular dependency resolution.',
    tags:   [
      { label: '🫘 Beans',            cls: 'tag-g' },
      { label: '📦 ApplicationContext', cls: 'tag-b' },
      { label: '🔄 Lifecycle',        cls: 'tag-o' },
      { label: '🔗 DI Internals',     cls: 'tag-g' },
    ],
    doodle: '☕',
    pages:  10,
  },
];
```

---

## Changes Made This Session

1. **Created `database-acid.astro`** — 10-page note covering ACID properties, MySQL internals, isolation levels, MVCC, anomalies, ACID vs BASE, interview Q&A

2. **Created `spring-transactional.astro`** — 12-page note covering @Transactional AOP proxy internals, propagation types, isolation levels, rollback rules, timeout, event listeners, common pitfalls, decision guide, interview Q&A

3. **Fixed PaginationController keyboard navigation** — Removed up/down arrow page navigation so they scroll normally. Only left/right arrows now change pages.

4. **Updated index.astro** — Added both new notes to the notes array

5. **Converted ASCII diagrams to visual components** — Replaced ASCII art in code blocks with proper `.flow-row`, `.phase-flow`, `.two-col` components in spring-transactional.astro (Page 2 proxy diagram, Page 11 propagation decision guide)

---

## Possible Next Steps

- Add more note pages (use the checklist above)
- Move `notes` array in `index.astro` to Astro content collection as count grows
- Add RSS feed + sitemap (`@astrojs/sitemap`)
- Make commits for the work done
- Consider adding search functionality as notes grow

---

## Key Files to Read First

1. `CLAUDE.md` — AI agent rules (non-negotiable)
2. `src/pages/notes/spring-boot-ioc.astro` — Template for new notes
3. `src/pages/style-guide.astro` — All available components
4. `src/styles/components.css` — Component CSS definitions
5. `src/components/PaginationController.astro` — Pagination logic
