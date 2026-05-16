# Astro Readable Content — Reference

## Content config example

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

## astro.config.mjs baseline

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
```

## Handwritten font alternatives

| Font | Use when |
|------|----------|
| Caveat | Default accent; natural stroke |
| Patrick Hand | Slightly more uniform; still soft |
| Kalam | Slightly bolder labels |
| Architects Daughter | Playful docs, not formal |

Always pair with a serious body face (Literata, Source Serif 4, Lora, Merriweather).

## Readability metrics (targets)

| Metric | Target |
|--------|--------|
| Line length | 60–75 characters |
| Body size | 17–18px |
| Line height (body) | 1.7–1.8 |
| Paragraph spacing | ≥ 1em between blocks |
| Section spacing | ≥ 2em before h2 |

## Useful Astro integrations

- `@astrojs/mdx` — interactive or component-rich posts
- `@astrojs/sitemap` — SEO sitemap
- `@astrojs/rss` — feed generation

Install only what the project needs; avoid unused integrations.
