# Publishing articles

Add entries to `src/data/articles.ts`. The catalog includes the bilingual P/NP article.

Shared fields: title, summary, topics (string array), language (e.g. en or th), publishedAt (ISO YYYY-MM-DD).

For local posts use kind: 'local', a unique slug, and load: () => import('../content/articles/your-slug.mdx'). Create that MDX file and write Markdown; import React illustrations directly when needed. Only trusted repository authors should edit executable MDX. Use one page title supplied by the reader and start content headings at h2. Optional series: { name: 'Series name', order: 1 } links published parts.

For external posts use kind: 'external', source (e.g. Medium), and the original HTTPS url. Supply a truthful summary; content is not copied or fetched automatically. Dates must be real publication dates.

Use meaningful image alt text. Interactive illustrations must support keyboard control and reduced motion and explain the same idea in text. Run npm test and npm run build before publishing through main.

## Multiple languages in one article

Use one registry entry and one canonical slug for an article. Its `language`, `title`, `summary`, and `load` describe the default version. Add `translations` keyed by language code (for example `en`), each containing its own `title`, `summary`, and MDX `load` function. The reader's language switch updates `?lang=en`; the list shows a single card and searches both versions. Keep the MDX files separate for editing and for shared React illustrations.

The P/NP article uses `/articles/what-is-p-and-np`, defaults to Thai, and offers English at `?lang=en`. Its `legacySlugs` map redirects the previous Thai and English URLs to the shared article.

## P/NP interactive article

The complete Thai and English articles live in `src/content/articles/what-is-p-and-np-{th,en}.mdx`. Edit prose there and import the shared React media from `src/features/articles/p-np`. Every component accepts `language="th"` or `language="en"`. Both versions use the same algorithm functions, board coordinates, graph weights, and controls.

The approved Thai proposal remains in `docs/articles/what-is-p-and-np-th-proposed.md`. The original raw MDX is preserved unchanged in `docs/articles/what-is-p-and-np-th-raw.mdx`; it is not part of the site's build.

Media uses native HTML/SVG, Framer Motion for user-triggered transitions, and no autoplay or additional rendering libraries. Steppers include previous, next, reset, and static result explanations; the queens board also accepts direct keyboard-operable button input. The growth chart labels its axes and scale and displays exact numeric values separately. The full article remains readable with reduced motion enabled.

Run `npx vitest run src/features/articles/p-np src/pages/ArticlePage.test.tsx --maxWorkers=1` and `npm run build` after changing the interactive article. Algorithm tests include exhaustive checks of 5-row queen placements, and integration tests render both real MDX files.
