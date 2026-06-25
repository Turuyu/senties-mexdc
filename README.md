# Senties Chauvet — Fianzas para Data Centers | MEXDC

Landing page de Senties Chauvet, agente afianzador miembro de la Asociación Mexicana de Data Centers (MEXDC). Built with Astro 5 + TypeScript, deployed to `dist/` as a fully static site.

## Stack

- **Framework**: Astro 5 (static SSG)
- **Language**: TypeScript (vanilla, no framework islands)
- **Styling**: CSS custom properties (design tokens)
- **Content**: Astro Content Collections with Zod schemas
- **Images**: Astro `<Image />` with explicit dimensions
- **Testing**: Vitest + Playwright + Lighthouse
- **View Transitions**: Astro `<ClientRouter />`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview built `dist/` |
| `npm run check` | Run Astro + TypeScript checks |
| `npm test` | Run Vitest unit tests (28/28) |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run lighthouse` | Run Lighthouse CI audit |

## Content Collections

All site content lives in `src/content/` with Zod validation:

| Collection | Schema keys | Content path |
|---|---|---|
| `services` | `title`, `description`, `icon`, `order` | `src/content/services/*.md` |
| `partners` | `name`, `order` | `src/content/partners/*.md` |
| `bonds` | `title`, `description`, `metric`, `order` | `src/content/bonds/*.md` |

To add a new service, partner, or bond type, create a `.md` file in the appropriate directory — the schema enforces validation automatically.

## Sections

- `#servicios` — Services offered
- `#niveles` — Service level commitments
- `#contacto` — Contact section

Anchor navigation with smooth scrolling is enabled site-wide.

## Deploy

The build produces a fully static `dist/` directory. Deploy to any static host:

```bash
npm run build
# serve dist/ with nginx, cloudflare pages, netlify, vercel, etc.
```

## Build Verification

```bash
npm test       # 28/28 Vitest tests
npm run build  # produces dist/
```

> Note: `astro check` reports ~70 pre-existing TS errors from test globals (`describe`, `test`, `expect`); these are outside the migration scope and do not affect the build.
