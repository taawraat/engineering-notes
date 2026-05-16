---
name: astro-readable-content
description: Builds Astro sites with expert patterns and writes highly readable content using eye-soothing handwritten typography. Use when developing Astro projects, authoring pages or posts, styling readable layouts, or when the user mentions Astro, content writing, readability, or handwritten fonts.
---

# Astro Readable Content

## Identity

Apply these standards on every Astro and content task:

- Best Astro developer in the world.
- Best content writer
- Handwritten eye soothing font css styling
- Best read friendly content creation

---

## Astro development

### Defaults

- Prefer **static output** and **content collections** for notes, docs, and blogs.
- Use **islands** only when interactivity is required; keep JS off the critical path.
- Colocate content (`src/content/`), layouts (`src/layouts/`), and UI (`src/components/`).
- Ship accessible, semantic HTML from layouts; enhance with CSS, hydrate sparingly.

### Structure

```
src/
  content/          # collections (markdown/mdx)
  layouts/          # BaseLayout, PostLayout
  components/       # reusable UI
  pages/            # routes
  styles/           # global + tokens
```

### Content collections

- Define schemas with Zod (`title`, `description`, `pubDate`, `draft`, `tags`).
- Use `getCollection`, `getEntry`, and `render()` for type-safe pages.
- Generate listing pages, RSS, and sitemaps from collection data.

### Performance and SEO

- Optimize images with `@astrojs/image` or `<Image />` (width, height, format).
- Set `<title>`, meta description, canonical URL, and Open Graph per page.
- Inline critical CSS for above-the-fold; defer non-critical styles.
- Target Lighthouse: fast LCP, minimal CLS, readable without JS.

### Patterns to prefer

| Task | Approach |
|------|----------|
| Blog/docs | `content collections` + `PostLayout` |
| Shared chrome | `BaseLayout.astro` with `<slot />` |
| MDX components | Import in `content.config` / MDX only where needed |
| Styling | Scoped component styles + global tokens in `global.css` |
| Navigation | File-based routing; active state via `Astro.url.pathname` |

### Anti-patterns

- Client-side routing for static content sites.
- Large client bundles for static articles.
- Skipping alt text, heading order, or focus styles.
- Hard-coded URLs instead of `import.meta.env.BASE_URL`.

---

## Content writing

### Voice and structure

- Lead with the **answer or outcome** in the first paragraph.
- One idea per section; headings that scan like an outline.
- Short paragraphs (2–4 sentences); break lists into bullets when comparing or enumerating.
- Use concrete examples, code snippets, or diagrams instead of abstract claims.
- End sections with a clear takeaway, not a vague summary.

### Technical writing

- Define terms on first use; link to deeper pages instead of repeating long explanations.
- Show command + expected output; note version or environment when it matters.
- Prefer active voice: “Run the build” not “The build should be run.”
- Front-load filenames, APIs, and constraints readers need to act.

### Editing pass (always)

1. Cut filler (“basically”, “simply”, “just”).
2. Check heading levels skip none (h1 → h2 → h3).
3. Verify every code block has language and context.
4. Read aloud once for rhythm and clarity.

---

## Handwritten eye soothing font css styling

### Font stack (default)

Use a **readable serif or sans** for body and a **soft handwritten face** for accents only (titles, pull quotes, labels)—never for long body copy.

```css
:root {
  /* Body: calm, highly legible */
  --font-body: "Literata", "Source Serif 4", Georgia, serif;
  /* Accents: handwritten, eye-soothing */
  --font-hand: "Caveat", "Patrick Hand", "Segoe Print", cursive;
  --font-ui: system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Soothing palette — low glare */
  --bg: #faf8f5;
  --bg-elevated: #fffefb;
  --text: #2c2825;
  --text-muted: #5c5650;
  --accent: #6b7f6a;
  --border: #e8e4df;

  /* Readability rhythm */
  --measure: 42rem;       /* ~65–70 characters */
  --line-body: 1.75;
  --line-heading: 1.25;
  --space-unit: 0.25rem;
}
```

Load fonts in layout `<head>` (subset weights only):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Literata:opsz,wght@7..72,400;7..72,600&display=swap"
  rel="stylesheet"
/>
```

### Typography rules

- **Body**: `--font-body`, `font-size: 1.0625rem` (17px) or `1.125rem` (18px), `line-height: var(--line-body)`.
- **Handwritten**: `--font-hand` on `h1`, `.eyebrow`, `.pull-quote` only; `font-weight: 400–600`; avoid ALL CAPS.
- **Contrast**: text on `--bg` ≥ 4.5:1; prefer warm neutrals over pure `#000` / `#fff`.
- **Spacing**: generous `padding` on `.prose`; `margin-block` between sections ≥ `2rem`.
- **Motion**: respect `prefers-reduced-motion`; no decorative animation on text.

### Prose container (Astro layout snippet)

```css
.prose {
  font-family: var(--font-body);
  color: var(--text);
  max-width: var(--measure);
  margin-inline: auto;
  padding: calc(var(--space-unit) * 6) calc(var(--space-unit) * 4);
  line-height: var(--line-body);
}

.prose h1 {
  font-family: var(--font-hand);
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: var(--line-heading);
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5em;
}

.prose h2,
.prose h3 {
  font-family: var(--font-body);
  font-weight: 600;
  margin-top: 2em;
}

.prose a {
  color: var(--accent);
  text-underline-offset: 0.15em;
}

.prose code {
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.9em;
  background: var(--bg-elevated);
  padding: 0.15em 0.35em;
  border-radius: 0.25em;
}
```

Apply in Astro: `<article class="prose">` wrapping `<slot />` or rendered MDX.

---

## Best read friendly content creation

### Layout checklist

- [ ] Single column, `max-width: var(--measure)` centered
- [ ] Comfortable font size (17–18px body) and line-height (1.7–1.8)
- [ ] Clear visual hierarchy (h1 once, logical h2/h3)
- [ ] Ample whitespace; no edge-to-edge text on mobile
- [ ] Dark mode optional: soften backgrounds (`#1a1917`), not OLED black

### Content checklist

- [ ] Title states benefit or outcome
- [ ] Meta description ≤ 160 characters, accurate
- [ ] TL;DR or summary for long posts (2–3 bullets)
- [ ] Tables have headers; images have alt text
- [ ] Links use descriptive anchor text

### Astro page template

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="prose">
    <header>
      <p class="eyebrow">{post.data.pubDate.toLocaleDateString()}</p>
      <h1>{post.data.title}</h1>
      {post.data.description && <p class="lead">{post.data.description}</p>}
    </header>
    <Content />
  </article>
</BaseLayout>
```

---

## Workflow

1. **Clarify intent** — audience, goal, and primary CTA.
2. **Structure** — outline headings before drafting.
3. **Implement in Astro** — layout, collection entry, prose styles.
4. **Typography pass** — body legibility first, handwritten accents second.
5. **Readability pass** — checklists above; fix scan path and contrast.
6. **Ship** — validate build, preview mobile width, confirm SEO meta.

## Additional resources

- Astro and collection details: [reference.md](reference.md)
