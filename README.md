# Hand Notes

A statically generated engineering notes site built with Astro. Notes are written as hand-styled HTML pages with a warm notebook aesthetic — graph-paper code blocks, handwritten fonts, and paginated page cards.

**Live site:** https://hand-notes.netlify.app

---

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Project structure

```
src/
  styles/
    tokens.css        # all CSS custom properties (--content-width, colors, spacing)
    themes.css        # [data-theme="cool/dark"] and [data-font="*"] overrides
    components.css    # every component class
    global.css        # resets + @imports for the three files above
  layouts/
    BaseLayout.astro  # HTML shell, Google Fonts, FOUC-prevention script
  components/
    SiteNav.astro
    ThemeFontPanel.astro
    PaginationController.astro
  pages/
    index.astro
    style-guide.astro
    notes/
      spring-boot-ioc.astro   # example note — 10 pages, paginated
```

---

## Adding a new note

1. Copy `src/pages/notes/spring-boot-ioc.astro` as your starting template.
2. Replace `{` and `}` in the HTML template section with `&#123;` and `&#125;` to prevent Astro treating them as JSX expressions.
3. Use `<pre class="code-block">` (not `<div>`) for every code block so Astro's HTML minifier does not collapse internal newlines.
4. Drop `<PaginationController />` at the bottom before `</BaseLayout>` to get free keyboard/swipe pagination.
5. Register the new note in the `notes` array inside `src/pages/index.astro`.

---

## Development guidelines

### Always check the style guide first

Open `/style-guide` in the browser before writing new content. Every component class, color token, diagram pattern, and list variant is demonstrated there. Do not invent new one-off styles — extend the design system instead.

### Read-friendly design is the top priority

- **Content width:** `--content-width` is `920px`. Do not add extra `max-width` constraints inside `.page` or `.cover` cards — they already handle centering.
- **Body text:** always use `.body-text` (18 px, line-height 2.0). Never drop below 15 px for reading copy.
- **Code blocks:** use `<pre class="code-block">` with syntax token spans (`.kw`, `.an`, `.cl`, `.st`, `.cm`, `.ar`). Font size is 13.5 px with line-height 1.9 — do not override without a strong reason.
- **Line length:** the 920 px container already sits comfortably within the ~70-character sweet spot at the default font size. Avoid two-column layouts for code-heavy content; use `.code-compare` for side-by-side code comparisons instead.

### Consistent styling rules

| Need | Use |
|------|-----|
| Note cover card | `.cover` with `.cover-subject`, `h1`, `.cover-sub`, `.cover-tags`, `.cover-doodle` |
| Two text/info columns | `.two-col` + `.col-card` |
| Two code comparisons | `.code-compare` + `.code-compare-panel` |
| Cheat-sheet grid | `.cheat-grid` + `.cheat-card` |
| Horizontal flow diagram | `.flow-row` + `.flow-box.fb-*` + `.flow-arr` |
| Vertical lifecycle diagram | `.phase-flow` + `.phase-box.ph-*` + `.phase-arrow` |
| Key callout | `.sticky` |
| Tip / insight | `.insight` (`.green-ins`, `.orange-ins`) |
| Inline emphasis | `.hl`, `.hl-green`, `.hl-blue`, `.hl-orange`, `.hl-purple` |
| Wavy underline | `.wu`, `.wu-o`, `.wu-b` |

### Cover card guidelines

The `.cover` is intentionally compact — it frames the note without dominating it:
- Write `h1` as a single sentence, no forced `<br />` line breaks. Let the text wrap naturally.
- `.cover-subject` — series label in small caps (e.g. `Spring Boot · Deep Dive Series`)
- `.cover-sub` — one short subtitle sentence
- `.cover-tags` — topic tags using `.tag.tag-g/b/o/p`
- `.cover-doodle` — a single emoji, purely decorative

### CSS Grid overflow — required fix

Every direct child of a CSS Grid container must have `min-width: 0` or it can burst outside its column. `.col-card`, `.cheat-card`, and `.scope-side` already include this. If you add a bare `<div>` as a grid child, add `style="min-width:0"` or give it a class that sets it.

### Themes and fonts

- **Themes:** `warm` (default) · `cool` · `dark`
- **Fonts:** `klee` (default) · `caveat` · `patrick` · `kalam`
- Stored in `localStorage` under `hn-theme` / `hn-font`. FOUC is prevented by an inline script in `BaseLayout.astro` — do not remove it.

---

## Deploy

Push to the `main` branch. Netlify picks up `netlify.toml` automatically:

```toml
[build]
  command   = "npm run build"
  publish   = "dist"

[build.environment]
  NODE_VERSION = "20"
```
