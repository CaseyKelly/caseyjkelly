import { Link } from "react-router";
import { Navigation } from "./nav";
import Sky from "./sky";

interface StatusPageProps {
  heading: string;
  message: string;
}

/** Full-page message for the 404 page and the root error boundary. */
export function StatusPage({ heading, message }: StatusPageProps) {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <Sky className="opacity-70" />
      <Navigation />
      <div className="container flex flex-col items-center justify-center min-h-[100dvh] px-4 py-20 mx-auto text-center">
        <h1 className="text-3xl text-white font-display sm:text-4xl">
          {heading}
        </h1>
        <p className="max-w-md mt-4 text-sm leading-relaxed text-zinc-400">
          {message}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mt-8 text-sm font-medium text-black transition-colors bg-white rounded-md hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
