"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tooltip({ children, content, side = "top", className }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const update = () => {
      const r = ref.current.getBoundingClientRect();
      setPos({
        x: r.left + r.width / 2,
        y: side === "top" ? r.top - 8 : r.bottom + 8,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, side]);

  const positions = {
    top: "translate-x(-50%) translate-y(-100%)",
    bottom: "translate-x(-50%)",
  };

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex"
      >
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, scale: 0.94, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: side === "top" ? 4 : -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "pointer-events-none fixed z-50 max-w-xs rounded-lg border border-white/10 bg-[#0a1020]/95 px-2.5 py-1.5 text-xs text-ink-100 shadow-xl shadow-black/40 backdrop-blur-md",
              positions[side],
              className,
            )}
            style={{ left: pos.x, top: pos.y }}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}
