<div align="center">
    <a href="https://caseyjkelly.com"><h1 align="center">caseyjkelly.com</h1></a>

My personal website, built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Upstash](https://upstash.com?ref=chronark.com), [Contentlayer](https://www.contentlayer.dev/) and deployed to [Vercel](https://vercel.com/).

</div>

<br/>

## Running Locally

```sh-session
git clone https://github.com/caseykelly/caseyjkelly.git
cd caseyjkelly
```

Create a `.env` file similar to `.env.example`

Then install dependencies and run the development server:

```sh-session
pnpm install
pnpm dev
```

## Testing

CI (`.github/workflows/ci.yml`) runs on every pull request, including Renovate's:

```sh-session
pnpm typecheck      # tsc --noEmit
pnpm test           # Vitest unit tests (pnpm test:coverage for a coverage report)
pnpm build          # production build
pnpm test:e2e       # Playwright against the production build, desktop + mobile Chrome
```

Unit tests sit next to the code they test as `*.test.tsx`, except API route tests, which live in `tests/` because Next.js serves every file under `pages/` as a route. End-to-end specs live in `e2e/`; every e2e test also fails on uncaught page errors, console errors, or assets that fail to load. Run `pnpm exec playwright install chromium` once before the first local e2e run.
