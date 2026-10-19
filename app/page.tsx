import Link from "next/link";
import React from "react";
import Sky from "./components/sky";

const navigation = [
  { name: "Projects", href: "/projects" },
  {
    name: "Resume",
    href: "/CaseyKellyResume.pdf",
    target: "_blank",
    // a file, not a route: prefetching would download the whole PDF on load
    prefetch: false,
  },
  { name: "Github", href: "https://github.com/CaseyKelly", target: "_blank" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/caseyjkelly",
    target: "_blank",
  },
  { name: "Contact", href: "/contact" },
];

const name = "casey kelly";
const letters = Array.from(name, (char, position) => ({
  char: char === " " ? "\u00A0" : char,
  delay: 700 + position * 70,
}));

export default function Home() {
  return (
    // min-h + w-full rather than h-screen/w-screen: 100vw includes the
    // scrollbar width and 100vh ignores mobile browser toolbars, and both
    // cause stray scrollbars
    <main className="relative isolate flex flex-col items-center justify-center w-full min-h-[100dvh] overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav
        aria-label="Primary"
        className="my-16 opacity-0 animate-fade-up [animation-delay:1300ms] motion-reduce:animate-none motion-reduce:opacity-100"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 px-4">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                target={item.target}
                prefetch={item.prefetch}
                className="block px-3 py-2 text-sm transition-colors duration-300 rounded-md text-zinc-400 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="hidden w-full h-px md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Sky />
      <h1
        aria-label={name}
        className="relative z-10 [font-kerning:none] text-4xl text-white cursor-default font-display sm:text-6xl md:text-9xl whitespace-nowrap [text-shadow:0_0_40px_rgba(165,180,252,0.35)]"
      >
        {letters.map(({ char, delay }) => (
          <span
            key={delay}
            aria-hidden="true"
            className="inline-block opacity-0 animate-letter-in motion-reduce:animate-none motion-reduce:opacity-100"
            style={{ animationDelay: `${delay}ms` }}
          >
            {char}
          </span>
        ))}
        {/* a band of light that sweeps across the name once it has landed */}
        <span
          aria-hidden="true"
          className="absolute inset-0 text-transparent [font-kerning:none] bg-clip-text bg-[length:250%_100%] bg-no-repeat bg-[linear-gradient(110deg,transparent_40%,rgba(199,210,254,0.95)_50%,transparent_60%)] animate-shine motion-reduce:hidden [text-shadow:none]"
        >
          {name.replace(" ", "\u00A0")}
        </span>
      </h1>

      <div className="hidden w-full h-px md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="px-6 my-16 text-center opacity-0 animate-fade-up [animation-delay:1600ms] motion-reduce:animate-none motion-reduce:opacity-100">
        <p className="max-w-xl mx-auto text-sm leading-relaxed text-zinc-400">
          Senior software engineer in Denver, CO. 10+ years building accessible
          React and TypeScript products, most recently in healthcare payments at
          Paytient.
        </p>
      </div>
    </main>
  );
}
