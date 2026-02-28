"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface InspirationalScrollHighlightProps {
  eyebrow?: string;
  title?: string;
  lines?: string[];
}

const DEFAULT_LINES = [
  "Te lo mereces.",
  "Respira profundo, suelta el ruido.",
  "Descansar no es perder tiempo, es recuperar energía.",
  "Tu cuerpo pide pausa, tu mente también.",
  "Menos prisa, más presencia.",
  "Reserva tu reset.",
];

interface HighlightItemProps {
  text: string;
  index: number;
  isActive: boolean;
  onEnter: (index: number) => void;
}

function HighlightItem({ text, index, isActive, onEnter }: HighlightItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    margin: "-45% 0px -45% 0px",
  });

  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);

  return (
    <div ref={ref} className="min-h-[20vh] md:min-h-[24vh] flex items-center">
      <motion.p
        className="text-2xl md:text-5xl font-semibold tracking-tight leading-tight"
        animate={{
          opacity: isActive ? 1 : 0.28,
          scale: isActive ? 1 : 0.96,
          x: isActive ? 0 : -6,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export default function InspirationalScrollHighlight({
  eyebrow = "Move · Breathe · Reset",
  title = "Cuando haces scroll, la frase correcta aparece en el centro.",
  lines = DEFAULT_LINES,
}: InspirationalScrollHighlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="rounded-2xl bg-brand-blue-dark text-white px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-4xl mx-auto">
        <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.18em]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl md:text-4xl font-bold leading-tight">
          {title}
        </h3>

        <div className="mt-8 md:mt-10">
          {lines.map((line, index) => (
            <HighlightItem
              key={`${line}-${index}`}
              text={line}
              index={index}
              isActive={activeIndex === index}
              onEnter={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
