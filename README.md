<div align="center">
    <a href="https://caseyjkelly.com"><h1 align="center">caseyjkelly.com</h1></a>

My personal website, built with [React Router](https://reactrouter.com/) (formerly Remix), [Tailwind CSS](https://tailwindcss.com/) and deployed to [Vercel](https://vercel.com/). Every page is prerendered to static HTML at build time.

</div>

<br/>

## Running Locally

```sh-session
git clone https://github.com/caseykelly/caseyjkelly.git
cd caseyjkelly
```

Then install dependencies and run the development server:

```sh-session
npm install
npm run dev
```

`npm run build` writes the static site to `build/client`, which Vercel serves as-is (see `vercel.json`). There is no server: every route is prerendered, and unknown paths get `404.html`.

## Testing

CI (`.github/workflows/ci.yml`) runs on every pull request, including Renovate's:

```sh-session
npm run format:check   # Prettier
npm run typecheck      # React Router route types + tsc
npm test               # Vitest unit tests (npm run test:coverage for a coverage report)
npm run build          # static production build
npm run test:e2e       # Playwright against that build, desktop + mobile Chrome
```

Unit tests sit next to the code they test as `*.test.tsx`; components that render a `<Link>` use `renderWithRouter()` from `app/test-utils.tsx`. End-to-end specs live in `e2e/` and run against `build/client` served by [`serve`](https://github.com/vercel/serve), which handles clean URLs and `404.html` the way Vercel does. Every e2e test also fails on uncaught page errors, console errors, or assets that fail to load. Run `npx playwright install chromium` once before the first local e2e run.

To add a page, add a route in `app/routes.ts`, list its path under `prerender` in `react-router.config.ts`, and add it to `public/sitemap.xml`.
