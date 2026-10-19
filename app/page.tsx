import Link from "next/link";
import React from "react";
import Constellation from "./components/constellation";

const navigation = [
  {
    name: "Resume",
    href: "https://casey-kelly-resume.s3.us-west-1.amazonaws.com/CaseyKellyResume.pdf",
    target: "_blank",
  },
  { name: "Github", href: "https://github.com/CaseyKelly", target: "_blank" },
  { name: "Contact", href: "/contact" },
];

const name = "casey kelly";
const letters = Array.from(name, (char, position) => ({
  char: char === " " ? "\u00A0" : char,
  delay: 700 + position * 70,
}));

export default function Home() {
  return (
    <div className="relative isolate flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.target}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none -z-20 animate-fade-in-fast"
      >
        <div className="absolute left-[18%] top-[22%] h-[38rem] w-[38rem] rounded-full bg-indigo-500/20 blur-[120px] animate-nebula motion-reduce:animate-none" />
        <div className="absolute right-[12%] bottom-[8%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/10 blur-[120px] animate-nebula motion-reduce:animate-none [animation-delay:-11s]" />
      </div>
      <Constellation className="absolute inset-0 -z-10" />
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

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="px-6 my-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500 ">
          I'm a full-stack software engineer from Denver, CO with 9 years of
          experience crafting engaging experiences for the web.
        </h2>
      </div>
    </div>
  );
}
