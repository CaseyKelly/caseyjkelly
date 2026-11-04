import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Github } from "../components/brand-icons";
import { Link } from "react-router";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";
import Sky from "../components/sky";
import { seo } from "../lib/seo";

export const meta = () =>
  seo({
    title: "Projects | caseyjkelly.com",
    path: "/projects",
    description:
      "Projects by Casey Kelly-Ajbani: FantasyPhish, a fantasy game for Phish tours; Curbcut, an AI agent that fixes accessibility bugs, in progress; Kelso Kelly Music, a musician's site that syncs from Google Calendar and Drive; and this site.",
  });

interface Project {
  name: string;
  tagline: string;
  // shown as a badge next to the name, for projects that aren't finished
  status?: string;
  description: ReactNode;
  stats?: { value: string; label: string }[];
  image: string;
  imageAlt: string;
  stack: string[];
  // the live site; projects without one link only to their source
  href?: string;
  hrefLabel?: string;
  source: string;
}

const projects: Project[] = [
  {
    name: "FantasyPhish",
    tagline: "Fantasy sports for Phish fans",
    description:
      "Pick 13 songs before each show, score points live as the band plays them, and climb the tour leaderboard. Scores update every 10 minutes during a show from phish.net setlists, picks lock at 7 PM in each venue's time zone, and it installs on your phone as a PWA.",
    // from the production database as of Oct 2026; round down so they stay
    // true as it grows
    stats: [
      { value: "200+", label: "players" },
      { value: "600+", label: "entries" },
      { value: "8,000+", label: "song picks" },
      { value: "46", label: "shows" },
    ],
    image: "/projects/fantasyphish.webp",
    imageAlt: "FantasyPhish landing page with the song picker",
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "Neon Postgres",
      "NextAuth",
      "PWA",
      "Playwright",
      "Vitest",
    ],
    href: "https://www.fantasyphish.com",
    hrefLabel: "Play at fantasyphish.com",
    source: "https://github.com/CaseyKelly/fantasyphish",
  },
  {
    name: "Curbcut",
    tagline: "Accessibility fixes in a pull request you approve",
    status: "Currently building",
    description: (
      <>
        An AI agent that finds accessibility bugs and fixes them. Point it at a
        URL and it scans the page against WCAG 2.1 AA, explains each issue in
        plain language, finds the React component in your repo that causes it,
        and drafts a minimal fix. Nothing changes until a person approves the
        diff; then it opens a pull request and re-scans the preview deploy.
        Prompt changes have to beat an eval suite, not just a demo. I'm building
        it now with my wife,{" "}
        <Link
          to="https://github.com/UpasanaAjbani"
          target="_blank"
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300/70 rounded-sm"
        >
          @UpasanaAjbani
        </Link>
        .
      </>
    ),
    image: "/projects/curbcut.webp",
    imageAlt: "Curbcut banner over a concept mockup of a scan in the terminal",
    stack: [
      "Next.js",
      "TypeScript",
      "Claude API",
      "axe-core",
      "Playwright",
      "Drizzle",
      "Postgres",
      "Zod",
      "Vitest",
    ],
    source: "https://github.com/CaseyKelly/Curbcut",
  },
  {
    name: "Kelso Kelly Music",
    tagline: "A musician's website that runs itself",
    description:
      "A production site for a Northern Colorado musician that uses Google Workspace as the CMS. He adds a gig to Google Calendar or drops photos and videos into Drive, and push-notification webhooks sync it to the site within seconds: photos are converted to WebP and served from a CDN, and raw videos are uploaded to YouTube by a GitHub Actions job.",
    image: "/projects/kelso-kelly.webp",
    imageAlt: "Kelso Kelly Music homepage",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Neon Postgres",
      "Google APIs",
      "Vercel Blob",
      "GitHub Actions",
      "Vitest",
      "Playwright",
    ],
    href: "https://www.kelsokellymusic.com",
    hrefLabel: "Visit kelsokellymusic.com",
    source: "https://github.com/CaseyKelly/kelso-kelly-site",
  },
  {
    name: "caseyjkelly.com",
    tagline: "The site you're on",
    description:
      "My personal site: an interactive starfield behind a name that leans toward your cursor, and a terminal tagline that keeps typing. Every animation respects reduced-motion settings. There's no server: every page is prerendered to static HTML at build time, and Playwright tests on desktop and mobile Chrome fail on any console error or broken asset.",
    image: "/projects/caseyjkelly.webp",
    imageAlt: "caseyjkelly.com home page: the name over a constellation",
    stack: [
      "React Router",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Motion",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    source: "https://github.com/CaseyKelly/caseyjkelly",
  },
];

export default function Projects() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-linear-to-tl from-black via-zinc-600/20 to-black">
      <Sky className="opacity-70" />
      <Navigation />
      <div className="container flex flex-col items-center justify-center min-h-dvh px-4 py-20 mx-auto">
        <h1 className="mb-10 text-3xl text-center text-white opacity-0 font-display sm:text-4xl md:mb-14 animate-fade-up motion-reduce:animate-none motion-reduce:opacity-100">
          Projects
        </h1>
        <ul className="grid w-full max-w-5xl gap-8">
          {projects.map((project, index) => (
            <li key={project.name}>
              <Card>
                <article className="relative z-20 grid gap-6 p-4 md:grid-cols-[1.15fr_1fr] md:gap-10 md:p-8">
                  <Link
                    to={project.href ?? project.source}
                    target="_blank"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block self-center overflow-hidden border rounded-lg border-zinc-700/80"
                  >
                    <img
                      src={project.image}
                      srcSet={`${project.image.replace(".webp", "-640.webp")} 640w, ${project.image} 1280w`}
                      alt={project.imageAlt}
                      width={1280}
                      height={800}
                      sizes="(min-width: 768px) 560px, 100vw"
                      // only the first card is above the fold on a phone
                      fetchPriority={index === 0 ? "high" : undefined}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </Link>
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h2 className="text-2xl text-white font-display md:text-3xl">
                        {project.name}
                      </h2>
                      {project.status && (
                        <p className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full text-amber-200 bg-amber-400/10 ring-1 ring-amber-300/30">
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse motion-reduce:animate-none"
                          />
                          {project.status}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-indigo-300">
                      {project.tagline}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                      {project.description}
                    </p>
                    {project.stats && (
                      <dl className="grid grid-cols-4 gap-2 py-4 mt-5 border-y border-zinc-800">
                        {project.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="flex flex-col-reverse"
                          >
                            <dt className="text-xs text-zinc-500">
                              {stat.label}
                            </dt>
                            <dd className="text-xl text-white font-display md:text-2xl">
                              {stat.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <ul
                      aria-label="Built with"
                      className="flex flex-wrap gap-1.5 mt-5"
                    >
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/80 text-zinc-300"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3 mt-6">
                      {project.href && (
                        <Link
                          to={project.href}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-black transition-colors bg-white rounded-md hover:bg-indigo-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          {project.hrefLabel}
                          <ArrowUpRight
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                        </Link>
                      )}
                      <Link
                        to={project.source}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border rounded-md text-zinc-200 border-zinc-600 hover:border-zinc-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300/70"
                      >
                        <Github className="w-4 h-4" aria-hidden="true" />
                        View source
                      </Link>
                    </div>
                  </div>
                </article>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
