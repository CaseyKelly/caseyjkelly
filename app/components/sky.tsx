import React from "react";
import Constellation from "./constellation";

interface SkyProps {
  className?: string;
}

/**
 * Shared page background: slow-drifting nebula glows behind the
 * interactive constellation. Fills its nearest positioned ancestor.
 */
export default function Sky({ className = "" }: SkyProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      <div className="absolute inset-0 animate-fade-in-fast">
        <div className="absolute left-[18%] top-[22%] h-152 w-152 rounded-full bg-indigo-500/20 blur-[120px] animate-nebula motion-reduce:animate-none" />
        <div className="absolute right-[12%] bottom-[8%] h-128 w-lg rounded-full bg-fuchsia-500/10 blur-[120px] animate-nebula motion-reduce:animate-none [animation-delay:-11s]" />
      </div>
      <Constellation className="absolute inset-0" />
    </div>
  );
}
