# AGENTS.md

Casey Kelly's personal site: React Router 7 in framework mode, Tailwind CSS 3, deployed to Vercel. See `README.md` for setup; this file covers what an agent needs on top of it.

## Before you push

Run what CI runs, in this order, and push only when all pass:

```sh
npm run format:check   # Prettier; fix with `npm run format`
npm run typecheck
npm test
npm run build
npm run test:e2e       # runs against build/, so build first
```

Node 22 (`engines` in `package.json`). Install with `npm ci`; never hand-edit `package-lock.json`, regenerate it with `npm install`.

For e2e in a sandbox with a preinstalled Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its path instead of running `npx playwright install`.

## Things that aren't obvious

- **There is no server.** `ssr: false` and every route is prerendered to static HTML (`react-router.config.ts`). Don't add `loader`/`action` code that needs a request at runtime, server-only modules, or API routes; they won't run on Vercel.
- **Adding a page touches three files:** the route in `app/routes.ts`, its path in `prerender` in `react-router.config.ts`, and an entry in `public/sitemap.xml`. Give it a `meta` export that spreads `seo()` from `app/lib/seo.ts`; route meta replaces the root's, it doesn't merge.
- **The 404 page** is prerendered at `/404` and moved to `build/client/404.html` by `buildEnd`, which is what Vercel serves for unknown paths. Keep `/404` in `prerender`.
- **E2E tests fail on any page error, console error, or failed asset request** (`e2e/fixtures.ts`). Import `test` from `./fixtures`, not `@playwright/test`. If a change logs to `console.error`, the e2e suite will catch it.
- **Unit tests** live next to their code as `*.test.tsx`. Components that render a `<Link>` need `renderWithRouter()` from `app/test-utils.tsx`.

## Conventions

- Match the surrounding code: function components, Tailwind utility classes, `lucide-react` for icons, `framer-motion` for animation.
- Static assets go in `public/`. Project images ship as `.webp` with a `-640` variant for small screens.
- Dependency updates come from Renovate (`renovate.json`); don't bump versions by hand unless that's the task.
