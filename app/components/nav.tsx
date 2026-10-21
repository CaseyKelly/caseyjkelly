import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import React, { useEffect, useRef, useState } from "react";

export const Navigation: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 duration-200 border-b ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/50 border-zinc-800 backdrop-blur"
        }`}
      >
        <div className="container flex flex-row items-center p-6 mx-auto">
          <Link
            to="/"
            aria-label="Back to home"
            className="p-1 -m-1 duration-200 rounded-md text-zinc-300 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
};
