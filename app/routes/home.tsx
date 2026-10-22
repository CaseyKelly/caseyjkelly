import { Link } from "react-router";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import Sky from "../components/sky";
import { SITE_URL, seo } from "../lib/seo";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const navigation = [
  { name: "Projects", href: "/projects", prefetch: "render" as const },
  {
    name: "Resume",
    href: "/CaseyKellyResume.pdf",
    target: "_blank",
    // a file, not a route: load it with a normal browser request
    reloadDocument: true,
  },
  { name: "Github", href: "https://github.com/CaseyKelly", target: "_blank" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/caseyjkelly",
    target: "_blank",
  },
  { name: "Contact", href: "/contact", prefetch: "render" as const },
];

const name = "casey kelly";
const letters = Array.from(name, (char) => (char === " " ? " " : char));

// cycled through by the terminal-style tagline under the name
const specialties = [
  "accessible interfaces",
  "reliable backend services",
  "design systems",
  "secure payment flows",
  "features end to end",
  "cloud infrastructure as code",
  "delightful micro-interactions",
  "fast, resilient frontends",
];
const SCRAMBLE_CHARS = "01<>/{}[]=+*#$";

// how far the name tilts toward the cursor, in degrees
const MAX_TILT = 9;
// letters within this many pixels of the cursor lift toward it
const LIFT_RADIUS = 240;
const MAX_LIFT = 18;
// share of the cursor's offset that a nav link follows
const MAGNET_STRENGTH = 0.35;

// Person data so search engines can tie the site to Casey's other profiles
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Casey Kelly",
  url: SITE_URL,
  jobTitle: "Senior Software Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denver",
    addressRegion: "CO",
    addressCountry: "US",
  },
  sameAs: [
    "https://github.com/CaseyKelly",
    "https://www.linkedin.com/in/caseyjkelly",
  ],
};

export const meta = () => [
  ...seo({
    title: "Casey Kelly | Senior Software Engineer in Denver",
    path: "/",
  }),
  { "script:ld+json": person },
];

export default function Home() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chars = gsap.utils.toArray<HTMLElement>("[data-char]");
        const specialty = scope.current?.querySelector("[data-specialty]");
        // hand the elements from the CSS fallback over to GSAP
        gsap.set(".intro-hidden", { animation: "none" });

        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .fromTo(
            chars,
            {
              opacity: 0,
              yPercent: 70,
              rotationX: -95,
              transformOrigin: "50% 100%",
            },
            {
              opacity: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1.4,
              stagger: { each: 0.06, from: "center" },
            },
            0.15,
          )
          .fromTo(
            "[data-rule]",
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.6, ease: "power3.inOut" },
            0.5,
          )
          .fromTo(
            "[data-tagline]",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.9,
          )
          .fromTo(
            specialty ?? [],
            { scrambleText: { text: "" } },
            {
              scrambleText: {
                text: specialties[0],
                chars: SCRAMBLE_CHARS,
                speed: 0.5,
              },
              duration: 1.2,
              ease: "none",
            },
            1,
          )
          .fromTo(
            "[data-nav-item]",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 },
            1.1,
          )
          .fromTo(
            "[data-intro]",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 1 },
            1.35,
          );

        // then keep decoding one specialty into the next
        const cycle = gsap.timeline({ repeat: -1, delay: intro.duration() });
        [...specialties.slice(1), specialties[0]].forEach((text) => {
          cycle.to(specialty ?? [], {
            scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.5 },
            duration: 1.1,
            delay: 2.6,
            ease: "none",
          });
        });
      });

      // pointer effects only make sense with a mouse or trackpad
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          const heading = scope.current?.querySelector<HTMLElement>("h1");
          if (!heading) return;
          const chars = gsap.utils.toArray<HTMLElement>("[data-char]");

          const tiltX = gsap.quickTo(heading, "rotationX", {
            duration: 0.8,
            ease: "power3",
          });
          const tiltY = gsap.quickTo(heading, "rotationY", {
            duration: 0.8,
            ease: "power3",
          });
          const lifts = chars.map((char) => ({
            y: gsap.quickTo(char, "y", { duration: 0.5, ease: "power3" }),
            scale: gsap.quickTo(char, "scale", {
              duration: 0.5,
              ease: "power3",
            }),
          }));

          const onPointerMove = (event: PointerEvent) => {
            const { innerWidth: w, innerHeight: h } = window;
            tiltY(((event.clientX - w / 2) / (w / 2)) * MAX_TILT);
            tiltX(((h / 2 - event.clientY) / (h / 2)) * MAX_TILT);

            // offsetLeft ignores transforms, so the lift can't feed back on itself
            const box = heading.getBoundingClientRect();
            const centerY = box.top + box.height / 2;
            chars.forEach((char, i) => {
              const centerX = box.left + char.offsetLeft + char.offsetWidth / 2;
              const distance = Math.hypot(
                event.clientX - centerX,
                event.clientY - centerY,
              );
              const pull = Math.max(0, 1 - distance / LIFT_RADIUS) ** 2;
              lifts[i].y(-pull * MAX_LIFT);
              lifts[i].scale(1 + pull * 0.12);
            });
          };

          const settle = () => {
            tiltX(0);
            tiltY(0);
            lifts.forEach((lift) => {
              lift.y(0);
              lift.scale(1);
            });
          };

          // nav links lean toward the cursor and spring back when it leaves
          const magnets = gsap.utils
            .toArray<HTMLElement>("[data-magnetic]")
            .map((link) => {
              const onMove = (event: PointerEvent) => {
                const box = link.getBoundingClientRect();
                gsap.to(link, {
                  x:
                    (event.clientX - box.left - box.width / 2) *
                    MAGNET_STRENGTH,
                  y:
                    (event.clientY - box.top - box.height / 2) *
                    MAGNET_STRENGTH,
                  duration: 0.4,
                  ease: "power3",
                  overwrite: "auto",
                });
              };
              const onLeave = () => {
                gsap.to(link, {
                  x: 0,
                  y: 0,
                  duration: 0.9,
                  ease: "elastic.out(1, 0.35)",
                  overwrite: "auto",
                });
              };
              link.addEventListener("pointermove", onMove);
              link.addEventListener("pointerleave", onLeave);
              return { link, onMove, onLeave };
            });

          window.addEventListener("pointermove", onPointerMove);
          document.documentElement.addEventListener("pointerleave", settle);

          return () => {
            window.removeEventListener("pointermove", onPointerMove);
            document.documentElement.removeEventListener(
              "pointerleave",
              settle,
            );
            magnets.forEach(({ link, onMove, onLeave }) => {
              link.removeEventListener("pointermove", onMove);
              link.removeEventListener("pointerleave", onLeave);
              // tweens started by the handlers aren't tracked by this context,
              // so stop them and put the link back ourselves
              gsap.killTweensOf(link);
              gsap.set(link, { clearProps: "transform" });
            });
          };
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    // min-h + w-full rather than h-screen/w-screen: 100vw includes the
    // scrollbar width and 100vh ignores mobile browser toolbars, and both
    // cause stray scrollbars
    <main
      ref={scope}
      className="relative isolate flex flex-col items-center justify-center w-full min-h-dvh overflow-hidden bg-linear-to-tl from-black via-zinc-600/20 to-black"
    >
      <nav aria-label="Primary" className="my-16">
        <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 px-4">
          {navigation.map((item) => (
            <li key={item.href} data-nav-item className="intro-hidden">
              <Link
                to={item.href}
                target={item.target}
                reloadDocument={item.reloadDocument}
                prefetch={item.prefetch}
                data-magnetic
                className="block px-3 py-2 text-sm transition-colors duration-300 rounded-md text-zinc-400 hover:text-white focus-visible:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300/70"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div
        data-rule
        className="hidden w-full h-px md:block intro-hidden bg-linear-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"
      />
      <Sky />
      <div className="relative z-10 py-4 perspective-[900px] drop-shadow-[0_0_40px_rgba(165,180,252,0.35)]">
        <h1
          aria-label={name}
          className="relative transform-3d [font-kerning:none] text-4xl text-white cursor-default font-display sm:text-6xl md:text-9xl whitespace-nowrap"
        >
          {letters.map((char, position) => (
            <span
              key={position}
              aria-hidden="true"
              data-char
              className="inline-block intro-hidden"
            >
              {char}
            </span>
          ))}
          {/* a band of light that sweeps across the name once it has landed */}
          <span
            aria-hidden="true"
            className="absolute inset-0 text-transparent [font-kerning:none] bg-clip-text bg-size-[250%_100%] bg-no-repeat bg-[linear-gradient(110deg,transparent_40%,rgba(199,210,254,0.95)_50%,transparent_60%)] animate-shine motion-reduce:hidden text-shadow-none"
          >
            {name.replace(" ", " ")}
          </span>
        </h1>
      </div>
      <p
        aria-hidden="true"
        data-tagline
        className="relative z-10 mt-4 font-mono text-xs tracking-wide sm:text-sm intro-hidden text-zinc-400"
      >
        <span className="text-indigo-300">~/denver</span>
        <span className="text-zinc-600"> $ </span>
        building{" "}
        <span data-specialty className="text-white">
          {specialties[0]}
        </span>
        <span className="ml-0.5 text-indigo-300 animate-blink motion-reduce:animate-none">
          ▍
        </span>
      </p>

      <div
        data-rule
        className="hidden w-full h-px mt-12 md:block intro-hidden bg-linear-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"
      />
      <div data-intro className="px-6 my-16 text-center intro-hidden">
        <p className="max-w-xl mx-auto text-sm leading-relaxed text-zinc-400">
          Senior software engineer in Denver, CO. 10+ years building accessible
          React and TypeScript products, most recently in healthcare payments at
          Paytient.
        </p>
      </div>
    </main>
  );
}
