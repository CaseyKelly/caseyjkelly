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

Before pushing, run the same checks as CI:

```sh-session
npm run format:check
npm run typecheck
npm run build
```

To add a page, add a route in `app/routes.ts`, list its path under `prerender` in `react-router.config.ts`, and add it to `public/sitemap.xml`.
