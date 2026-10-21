import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import Sky from "../components/sky";
import { seo } from "../lib/seo";

const socials = [
  {
    icon: <Linkedin size={20} />,
    href: "https://www.linkedin.com/in/caseyjkelly",
    target: "_blank",
    label: "LinkedIn",
    handle: "caseyjkelly",
  },
  {
    icon: <Mail size={20} />,
    href: "mailto:casey.kelly819@gmail.com",
    label: "Email",
    handle: "casey.kelly819@gmail.com",
  },
  {
    icon: <Github size={20} />,
    href: "https://github.com/CaseyKelly",
    target: "_blank",
    label: "Github",
    handle: "CaseyKelly",
  },
];

export const meta = () =>
  seo({
    title: "Contact | caseyjkelly.com",
    path: "/contact",
    description: "Get in touch with Casey Kelly by email, LinkedIn or GitHub.",
  });

export default function Contact() {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <Sky className="opacity-70" />
      <Navigation />
      <div className="container flex flex-col items-center justify-center min-h-[100dvh] px-4 py-20 mx-auto">
        <h1 className="mb-10 text-3xl text-center text-white opacity-0 font-display sm:text-4xl md:mb-14 animate-fade-up motion-reduce:animate-none motion-reduce:opacity-100">
          Get in touch
        </h1>
        <div className="grid w-full grid-cols-1 gap-6 mx-auto sm:grid-cols-3 lg:gap-12">
          {socials.map((s) => (
            <Card key={s.label}>
              <Link
                to={s.href}
                target={s.target}
                className="relative flex flex-col items-center gap-4 p-6 duration-700 rounded-xl group md:gap-8 md:px-10 md:pt-20 md:pb-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300/70"
              >
                <span
                  className="absolute hidden w-px md:block h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                  {s.icon}
                </span>{" "}
                <div className="z-10 flex flex-col items-center">
                  <span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
                    {s.handle}
                  </span>
                  <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                    {s.label}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
