import { ArrowUpRight, Github } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";
import Sky from "../components/sky";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things Casey Kelly has built.",
};

const projects = [
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
];

export default function Projects() {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <Sky className="opacity-70" />
      <Navigation />
      <div className="container flex flex-col items-center justify-center min-h-[100dvh] px-4 py-20 mx-auto">
        <h1 className="mb-10 text-3xl text-center text-white opacity-0 font-display sm:text-4xl md:mb-14 animate-fade-up motion-reduce:animate-none motion-reduce:opacity-100">
          Projects
        </h1>
        <ul className="grid w-full max-w-5xl gap-8">
          {projects.map((project) => (
            <li key={project.name}>
              <Card>
                <article className="relative z-20 grid gap-6 p-4 md:grid-cols-[1.15fr_1fr] md:gap-10 md:p-8">
                  <Link
                    href={project.href}
                    target="_blank"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block self-center overflow-hidden border rounded-lg border-zinc-700/80"
                  >
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      width={1280}
                      height={800}
                      sizes="(min-width: 768px) 560px, 100vw"
                      priority
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </Link>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-2xl text-white font-display md:text-3xl">
                      {project.name}
                    </h2>
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
                      <Link
                        href={project.href}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-black transition-colors bg-white rounded-md hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        {project.hrefLabel}
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href={project.source}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border rounded-md text-zinc-200 border-zinc-600 hover:border-zinc-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70"
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
