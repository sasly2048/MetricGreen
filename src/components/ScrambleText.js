"use client";

import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export function useScrambleText(text, playOnHover = false) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerScramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    let iterations = 0;
    const maxIterations = 12; // How many times it scrambles

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      iterations += 1;

      if (iterations >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, 40); // speed of scramble
  };

  // Run on mount
  useEffect(() => {
    if (!playOnHover) {
      triggerScramble();
    }
  }, [text]);

  return { displayText, triggerScramble };
}

export function ScrambleLabel({ text, className = "" }) {
  const { displayText, triggerScramble } = useScrambleText(text, true);

  return (
    <span className={className} onMouseEnter={triggerScramble}>
      {displayText}
    </span>
  );
}
