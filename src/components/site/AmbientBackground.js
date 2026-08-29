"use client";

import { useEffect, useState } from "react";

export function AmbientBackground() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handler = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern-fine opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(16,185,129,0.05), transparent 50%)`,
        }}
      />

      <div className="absolute -left-32 -top-32 h-[42rem] w-[42rem] rounded-full bg-emerald-500/[0.05] blur-[120px] animate-float" />
      <div
        className="absolute -right-32 top-[20%] h-[36rem] w-[36rem] rounded-full bg-indigo-500/[0.04] blur-[120px] animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute bottom-[-10rem] left-[30%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/[0.03] blur-[120px] animate-float"
        style={{ animationDelay: "-5s" }}
      />
    </div>
  );
}
