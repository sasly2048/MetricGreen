"use client";

import { useEffect } from "react";
import { initAudio } from "@/lib/sfx";

export function AudioBootstrap() {
  useEffect(() => {
    const handler = () => {
      initAudio();
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
    window.addEventListener("pointerdown", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, []);
  return null;
}
