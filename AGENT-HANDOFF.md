# Hand Notes — Full Agent Handoff Context

> Updated handoff after the **emoji cleanup session** (2026-05-17). Read this end-to-end before touching any file.

---

## 1. Project Identity

- **Name:** Hand Notes — a static Astro v5 site for engineering notes
- **Repo:** `/home/tawrat/engineering-notes` (branch `main`, clean working tree)
- **Live:** https://hand-notes.netlify.app
- **Aesthetic:** warm paper notebook — graph-paper code blocks, handwritten fonts, paginated page cards. **Readability is the top priority on every decision.**

### Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

---

## 2. File Tree & Routes

```
/
├── .gitignore                   # ignores: .agents/, skills-lock.json, .astro/, dist/, node_modules/
├── README.md                    # developer guide
├── CLAUDE.md                    # AI agent rules — READ THIS FIRST
├── AGENT-HANDOFF.md             # this file
├── netlify.toml
├── astro.config.mjs             # output:'static', site:'https://hand-notes.netlify.app'
├── package.json                 # astro@^5.7.0
├── public/favicon.svg
└── src/
    ├── styles/
    │   ├── tokens.css           # all CSS custom properties
    │   ├── themes.css           # [data-theme="cool/dark"] + [data-font="*"] overrides
    │   ├── components.css       # every component class + responsive rules
    │   └── global.css           # resets, lined-paper body bg, @imports
    ├── layouts/
    │   └── BaseLayout.astro     # HTML shell, Google Fonts, FOUC script
    ├── components/
    │   ├── SiteNav.astro
    │   ├── ThemeFontPanel.astro
    │   └── PaginationController.astro
    └── pages/
        ├── index.astro                  # notes listing (hardcoded array)
        ├── style-guide.astro            # design system showcase
        └── notes/
            ├── spring-boot-ioc.astro       # 10 pages
            ├── database-acid.astro         # 10 pages
            └── spring-transactional.astro  # 12 pages
```

| Route | File |
|---|---|
| `/` | `index.astro` |
| `/notes/spring-boot-ioc/` | `notes/spring-boot-ioc.astro` |
| `/notes/database-acid/` | `notes/database-acid.astro` |
| `/notes/spring-transactional/` | `notes/spring-transactional.astro` |
| `/style-guide/` | `style-guide.astro` |

---

## 3. Session History (most recent first)

### Session 2 — commit `5d00070 — replace emoji with sketch-like text symbols across all notes`

Replaced all colorful/decorative emoji across all three note files with sketch-like Unicode text symbols. These characters inherit the CSS text color and render like hand-drawn pen marks — consistent across all three themes (warm/cool/dark).

#### The sketch-like symbol palette (use this for any new content)

| Symbol | Meaning / Used for |
|---|---|
| `★` | concept, definition, key insight, mental model, "Remember" |
| `✎` | notes, cheat sheet, interview Q&A, "Next to Study" |
| `⚡` | deep dive, internals, crash recovery, critical path |
| `↺` | lifecycle, propagation, cycles, MVCC |
| `◎` | isolation, focus/zoom, resolution, decision guide |
| `✓` | correct, valid, success, "With X" comparison labels |
| `✗` | error, bug, violation, "Without X" comparison labels |
| `≡` | overview, all attributes, stack layers, summary |
| `?` | question stickies (e.g. "? Does Spring create new objects?") |
| `!` | warning, caution, common bug source |
| `→` | dependency injection direction |
| `◷` | timeout / time-bounded operations |
| `◉` | database / record symbol (used as cover doodle in database-acid) |

#### What was changed in each file

**Cover tags** — emoji stripped entirely from all three files. The colored `.tag` chips already convey meaning through color; emoji was redundant clutter.

**Cover doodles** (the large decorative display symbol):
- `spring-boot-ioc.astro`: `☕` → `✍`
- `database-acid.astro`: `🗄️` → `◉`
- `spring-transactional.astro`: `🔁` → `↺`

**Section icons** (`.section-icon` in every `.section-header`) — replaced with sketch palette above per semantic meaning of each page topic.

**Sticky labels** (`.sticky-label`) — all emoji replaced with `★`, `✎`, `!`, `✗`, or `?`.

**Insight labels** (`.insight-label`) — all emoji replaced with `★`, `⚡`, `✓`, `✗`, or `!`.

**Phase box titles** (`.ph-title` text) — emoji removed entirely. The text already conveys meaning; emoji was redundant inside the boxes. e.g. `📋 Definition` → `Definition`, `📞 App calls commit()` → `App calls commit()`.

**Cheat card titles** (`.cheat-card-title`) — emoji removed entirely. The cards are already color-coded by `.cheat-card` border color.

**Inline content markers** — `✅` → `✓`, `⭐` → `★`, `❌` → `✗` throughout.

**Preserved untouched** — all emoji/symbols inside `<pre class="code-block">` elements (code comments like `// ✅ Works`). Code content is never modified.

#### Special exception — Page 2 of `database-acid.astro`

The Atomicity bank-transfer code-compare on Page 2 contains `💥`, `🔥`, `✅` inside the protected ASCII prose-in-`<pre>` blocks. **These were NOT changed.** The user has explicitly reverted any modifications to that page twice — do not touch it.

---

### Session 1 — commit `4c6bbb2 — feat: design fixed`

Focused on enforcing Rule #6 (no ASCII art in code blocks) across `database-acid.astro` and upgrading the `.note-table` design system to a self-contained paper card.

#### `database-acid.astro` content conversions

| Page | Section | Before | After |
|------|---------|--------|-------|
| 2 | Without/With Atomicity (bank transfer) | ASCII prose-in-`<pre>` | **KEPT AS-IS** — do not touch. |
| 3 | What "Valid State" Means | ASCII tree (`├── └──`) inside `<pre>` | `.note-table` (Constraint → Rule it enforces) |
| 4 | Anomaly 1: Dirty Read | ASCII timeline `│ ─ ┼` inside `<pre>` | 3-column `.note-table` (Time × Tx A × Tx B) |
| 4 | Anomaly 2: Non-Repeatable Read | same | same |
| 4 | Anomaly 3: Phantom Read | same | same |
| 5 | Anomaly 4: Lost Update | same + dangling spans | `.note-table` + `.insight orange-ins` for Expected vs Actual |
| 6 | Hidden Row Metadata | ASCII box (`┌─┬┐`) | `.note-table` (4 cols) + `.two-col` `.col-card`s for `DB_TRX_ID` / `DB_ROLL_PTR` |
| 6 | Read View — Snapshot Isolation | prose in `<pre>` + redundant `.phase-flow` | body-text intro + `.sticky` + enriched `.phase-flow` with TXN numbers |
| 7 | Without/With Durability | two `.code-compare` panels with prose-in-`<pre>` | single 3-column `.note-table` (Step × Without × With) |
| 7 | Redo Log & WAL | ASCII box-flow inside `<pre>` | body-text intro + `.sticky` + `.phase-flow` 3-step sequence + `.insight` |

#### Anomaly table convention (Pages 4–5) — copy this pattern

```html
<table class="note-table">
  <thead>
    <tr><th style="width:60px">Time</th><th>Transaction A (Reader)</th><th>Transaction B (Writer)</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>T1</strong></td><td><code>BEGIN</code></td><td></td></tr>
    <tr><td><strong>T2</strong></td><td></td><td><code>UPDATE</code> balance = 500</td></tr>
    <!-- ... -->
  </tbody>
</table>
```

- Narrow `width:60px` Time column anchors each row.
- Empty `<td>` cells = transaction is idle.
- `<code>` for SQL keywords (`BEGIN`, `UPDATE`, `SELECT`, `COMMIT`, `ROLLBACK`).
- `.hl-green` for correct values, `.hl-orange` for anomalous values.
- Italic `<em>` for side-notes like `(not yet committed)`.

#### `.note-table` CSS design (do not undo)

```css
.note-table {
  position: relative; z-index: 1;
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-family: var(--font-body);
  font-size: 15px;
  background: var(--paper);                                      /* opaque base */
  border-radius: var(--radius-md);
  overflow: hidden;                                              /* clip rounded corners */
  box-shadow: 0 0 0 1px var(--rule-line), 0 1px 3px var(--shadow); /* outer ring + soft shadow */
}
.note-table th  { background: var(--green-bg); color: var(--green); ... padding: 10px 14px; border-bottom: 2px solid var(--green-light); }
.note-table td  { padding: 10px 14px; border-bottom: 1px solid var(--rule-line); ... background: var(--paper); }
.note-table tr:last-child td       { border-bottom: none; }
.note-table tr:nth-child(even) td  { background: var(--paper2); }
.note-table th + th,
.note-table td + td               { border-left: 1px solid var(--rule-line); }
```

Key decisions:
1. **Opaque cell backgrounds** — page's lined-paper texture bleeds through transparent cells, creating cross-hatched chaos.
2. **`box-shadow` ring** instead of `border` — `border-collapse: collapse` fights with `border-radius`; shadow rings don't.
3. **Token-based** (`--paper`/`--paper2`) — works in all three themes inherently.
4. **Adjacent-sibling `border-left`** — internal column dividers without an outer frame.

#### Documentation updates (Session 1)

| File | Change |
|------|--------|
| `CLAUDE.md` | Added Rule #6 — "Use real components instead of ASCII art". Renumbered mobile rule from 6 → 7. |
| `README.md` | Added `.note-table` and `.note-list` to the styling rules table. |
| `src/pages/style-guide.astro` | Added `.note-table` paper-card demo, timeline pattern example, and `.insight orange-ins` warning against ASCII tables. |
| `.gitignore` | Added `.agents/` and `skills-lock.json`. |

---

## 4. Non-Negotiable Rules (from `CLAUDE.md`)

1. **Read-friendly design always wins** — body 18px line-height 2.0, code 13.5px line-height 1.9, content width 920px, prefer one column.
2. **Always use `<pre>` for code blocks** — Astro's HTML minifier collapses newlines inside `<div>` siblings. `<pre>` is HTML-spec protected.
3. **Escape `{` → `&#123;` and `}` → `&#125;`** in `.astro` template sections (after second `---`). Frontmatter JS is unaffected.
4. **Check the style guide first** at `/style-guide` — every component is demonstrated there. Don't invent one-off styles.
5. **CSS Grid children need `min-width: 0`** — direct `<div>` grid children must have it set.
6. **Use real components instead of ASCII art** — never draw with `│ ─ ┼ ┌ └ ▶` inside `<pre class="code-block">`. The page's lined-paper texture turns ASCII grids into visual noise.

   | Pattern | Use |
   |---|---|
   | Horizontal step flow | `.flow-row` + `.flow-box.fb-*` + `.flow-arr` |
   | Vertical step flow / lifecycle | `.phase-flow` + `.phase-box.ph-*` + `.phase-arrow` |
   | Side-by-side text comparison | `.two-col` + `.col-card` |
   | Side-by-side code comparison | `.code-compare` + `.code-compare-panel` |
   | Time-series / concurrency timeline | `<table class="note-table">` (narrow Time column + per-actor columns) |
   | Reference data / lookup | `<table class="note-table">` |

7. **Mobile-first** — three breakpoints in `components.css`:
   - `≤ 768px` tablet — tighten padding
   - `≤ 640px` mobile — single-column, smaller text, hide `.page-num`, disable `.sticky` rotation, tables become `display: block; overflow-x: auto`
   - `≤ 480px` small phones — hide pagination title, compact nav

8. **Cover `h1` is one sentence, no `<br />`** — 34px font wraps naturally.

9. **Emoji rule (new)** — use sketch-like Unicode text symbols (see Section 3 palette) for all new decorative markers. Never add colorful multi-color emoji to section icons, sticky labels, insight labels, phase box titles, or cheat card titles. Emoji inside `<pre class="code-block">` (code comments) are untouched.

---

## 5. CSS Architecture

```
global.css
  @import tokens.css        ← :root variables (paper, ink, accents, shadows)
  @import themes.css        ← [data-theme="cool|dark"] + [data-font="*"] overrides
  @import components.css    ← all components + responsive
```

### Token reference (`tokens.css`)

```css
:root {
  --font-body: 'Klee One', cursive;
  --font-hand: 'Gochi Hand', cursive;
  --font-mono: 'JetBrains Mono', monospace;

  --paper: #fdf8f0;   --paper2: #fef9f2;
  --ink: #2d2318;     --ink2: #4a3728;    --ink3: #6b5040;
  --body-bg: #e8e0d0; --rule-line: #e8dcc8; --grid: #f0e8d8; --body-rule: #d8cfc0;

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

### Themes & fonts

- **Themes:** `warm` (default) · `cool` · `dark` — via `data-theme` on `<html>`
- **Fonts:** `klee` (default) · `caveat` · `patrick` · `kalam` — via `data-font` on `<html>`
- Persisted in `localStorage` (`hn-theme`, `hn-font`).
- FOUC prevented by inline `<script>` in `<head>` of `BaseLayout.astro` — do not remove.
- Theme panel: floating button bottom-right → `ThemeFontPanel.astro`.

---

## 6. Component Reference

```
Cover card        .cover
                    .cover-subject  ← series label, small caps
                    h1              ← single sentence, NO <br />
                    .cover-sub      ← one subtitle line
                    .cover-tags     ← .tag.tag-g/b/o/p chips (NO emoji inside tags)
                    .cover-doodle   ← single sketch-like Unicode symbol

Page card         .page [.green|blue|orange|purple|red-spine]
Page section hdr  .section-header > .section-icon + .section-title + .section-num
                    .section-icon uses sketch symbols (★ ✎ ⚡ ↺ ◎ ✓ ✗ ≡ → ◷)
Page number       .page-num (hidden ≤ 640px)
Subsection hdgs   h2.sub · h3.sub

Prose             .body-text (18px / line-height 2.0)
Inline code       <code>
Code block        <pre class="code-block [color]-left">     ← ONLY for actual code
                    Syntax: .kw .an .cl .st .cm .ar
Code comparison   .code-compare > .code-compare-panel
                    .code-compare-label [.g|.r|.b]  ← use ✓ / ✗ prefix, not ✅ / ❌
                    .code-compare-sep
                    .code-compare-note

Two-col text      .two-col > .col-card
                    .col-card-title [.g|.r|.b|.o]
Cheat grid        .cheat-grid > .cheat-card
                    .cheat-card-title ← NO emoji; text only
Flow diagram      .flow-row > .flow-box.fb-[gray|blue|green|purple|orange] + .flow-arr
Lifecycle flow    .phase-flow > .phase-box.ph-[gray|blue|green|orange|purple|red] + .phase-arrow
                    .ph-title ← NO emoji; text only
Diagram wrap      .diag-wrap (graph paper bg, overflow-x: auto)

Sticky callout    .sticky (.sticky-label + <p>)
                    .sticky-label uses sketch symbols only (★ ✎ ⚡ ! ? ✗)
Insight box       .insight [.green-ins|.orange-ins]
                    .insight-label uses sketch symbols only (★ ⚡ ✓ ✗ !)

Bullet list       .note-list > li [.sq|.ck|.cr|.st]
Table             <table class="note-table">  ← paper card; reference data + timelines
                    (auto: opaque cells, outer ring, soft shadow, mobile auto-scroll)
Tags              .tag [.tag-g|.tag-b|.tag-o|.tag-p]  ← text only inside, no emoji

Inline highlight  .hl .hl-green .hl-blue .hl-orange .hl-purple
Wavy underline    .wu (green) .wu-o (orange) .wu-b (blue)
Margin note       .margin-note
```

### Code-block syntax classes (only valid inside `.code-block`)

```
.kw  → keyword (public, class, BEGIN, SELECT, ...)
.an  → annotation (@Service, @Transactional, ...)
.cl  → class name (BankService, String, ...)
.st  → string literal ("hello", numbers)
.cm  → comment (// comment)
.ar  → arrow/operator (→, =, ...)
```

These classes do **not** style outside a code block — for tables/cards use `<code>` for monospace + `.hl-*` for highlights.

---

## 7. Pagination System (`PaginationController.astro`)

- Finds all `.page` elements inside `.content-wrap` (`.cover` is untouched).
- Hides all except the current page.
- Adds `body.pg-mode` → `padding-bottom: 72px` for bar clearance.
- Fixed bottom bar: ← / → buttons, page counter "pg 03 / 10", section title, dot indicators.
- Green progress bar fixed at `top: 52px`.
- Navigation: buttons, dots, keyboard (`←` / `→` only — up/down scroll normally), horizontal swipe ≥ 60px.
- **Swipe guard** — `isInsideHScrollable` walks the DOM on `touchend`; if any ancestor has `overflow-x: auto|scroll` AND `scrollWidth > clientWidth`, swipe is treated as scroll (skips page nav). Code blocks, diagram wrappers, and mobile tables are protected automatically. **Never remove this guard.**
- URL hash: `#page-3` via `history.replaceState`, restored on load.

---

## 8. Adding a New Note (Checklist)

1. Copy `src/pages/notes/spring-boot-ioc.astro` as template.
2. Replace **all** `{` → `&#123;` and `}` → `&#125;` in the HTML section (after second `---`).
3. Use `<pre class="code-block">` for every actual code block (never `<div>`).
4. **For tables, timelines, comparisons** — use the proper component (Rule #6). Never draw with ASCII characters.
5. **For icons and labels** — use the sketch symbol palette from Section 3. No colorful emoji.
6. Cover `h1` = single sentence, no `<br />`. Cover tags = text only, no emoji.
7. Add `<PaginationController />` before `</BaseLayout>`.
8. Register the note in the `notes` array in `src/pages/index.astro`.

---

## 9. Current Notes in `src/pages/index.astro`

```javascript
const notes = [
  { href: '/notes/spring-transactional/',  pages: 12, ... },  // @Transactional deep dive
  { href: '/notes/database-acid/',         pages: 10, ... },  // ACID properties + MySQL internals
  { href: '/notes/spring-boot-ioc/',       pages: 10, ... },  // IoC, beans, DI
];
```

---

## 10. User Preferences (Observed)

- **Compact, read-friendly** trumps decorative — when phase-flow felt "too big" for the bank transfer, user preferred the original ASCII prose. The decision turns on content density per pixel.
- **Industrial-standard solutions with minimal changes** — explicit user rule. Don't refactor adjacent code unprompted.
- **Commit messages:** short, lowercase, imperative. Examples: `feat: design fixed`, `add spring-aop note`, `fix code block overflow`, `replace emoji with sketch-like text symbols across all notes`.
- **Tables must have visible internal grid lines** — column dividers are non-negotiable for readability.
- **One job per component** — user pushed back when the same flow was repeated in both prose and `.phase-flow`. Each visual element should do exactly one thing.
- **The Atomicity bank transfer (Page 2 of database-acid)** must remain in its original ASCII prose-in-code form. User reverted conversion attempts twice. **Do not touch.**
- **Sketch-like symbols over colorful emoji** — user explicitly requested replacing emoji with hand-drawn-looking Unicode symbols for better theme compatibility. The symbols inherit CSS text color and look like pen marks on paper. This is now the standard for all new content.

---

## 11. Possible Next Steps

- Add a new note (e.g. Spring AOP internals, JVM memory model, database indexing / B+ Tree).
- Move the `notes` array in `index.astro` to an Astro content collection as the count grows.
- Add `@astrojs/sitemap` + RSS feed (`@astrojs/rss`).
- Add search functionality as notes grow.
- Audit any remaining ASCII art (`│ ─ ┼ ┌ └ ▶`) inside `<pre class="code-block">` across all notes (Rule #6).

---

## 12. Files to Read First (in order)

1. **`CLAUDE.md`** — non-negotiable rules (Rules 1–9 including emoji rule).
2. **`/style-guide` route** (`src/pages/style-guide.astro`) — visual demo of every component including `.note-table` paper card.
3. **`README.md`** — developer guide + styling rules table.
4. **`src/styles/components.css`** — single source of truth for all component CSS. `.note-table` block is the model for future paper-card components.
5. **`src/pages/notes/database-acid.astro`** — reference for `.note-table` timelines (Pages 4–5), `.note-table` row metadata (Page 6), `.sticky` + `.phase-flow` rhythm (Pages 6–7), and the sketch symbol palette in action.

---

## 13. Quick "Don't Break These" List

- ✗ Don't draw tables with `│ ─ ┼ ┌ └ ▶` inside `<pre>` — use `<table class="note-table">` (Rule #6).
- ✗ Don't use `.kw / .cm / .st` syntax classes outside `.code-block` — they're scoped to that selector.
- ✗ Don't add `border` (instead of `box-shadow`) to `.note-table` — it fights with `border-collapse: collapse` + `border-radius`.
- ✗ Don't make table cells transparent — page lines bleed through.
- ✗ Don't touch the Atomicity bank-transfer comparison on Page 2 of `database-acid.astro` — user wants the ASCII version.
- ✗ Don't remove the `isInsideHScrollable` guard in `PaginationController.astro`.
- ✗ Don't use bare `<div>` as a CSS Grid child without `min-width: 0`.
- ✗ Don't put `<br />` tags in cover `h1`.
- ✗ Don't forget to escape `{` and `}` in `.astro` templates.
- ✗ Don't add colorful emoji to section icons, sticky labels, insight labels, phase box titles, cheat card titles, or cover tags — use the sketch symbol palette (★ ✎ ⚡ ↺ ◎ ✓ ✗ ≡ ? ! → ◷ ◉) instead.
- ✗ Don't modify emoji/symbols inside `<pre class="code-block">` content — code is untouched.
