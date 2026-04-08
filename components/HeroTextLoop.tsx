"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface HeroTextLoopProps {
  words: string[];
  className?: string;
}

export default function HeroTextLoop({
  words,
  className = "",
}: HeroTextLoopProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span
      className={`font-title-medium inline-grid relative overflow-hidden ${className}`}
    >
      {/* Invisible element to reserve width for the widest word to prevent layout shift */}
      <span
        className="invisible font-medium leading-tight opacity-0 pointer-events-none select-none whitespace-nowrap"
        aria-hidden="true"
      >
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>

      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            y: { type: "spring", stiffness: 100, damping: 20 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 flex items-center leading-tight whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
