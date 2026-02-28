"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface LineConfig {
  text: string;
  speed: number;
}

const LINES: LineConfig[] = [
  { text: "Te lo mereces", speed: 18 },
  { text: "Respira, suelta, vuelve a ti", speed: 26 },
  { text: "Menos ruido, más presencia", speed: 22 },
  { text: "Tu descanso también es productividad", speed: 30 },
  { text: "Muévete con calma, vive con intención", speed: 24 },
  { text: "Reserva tu reset", speed: 32 },
];

function AnimatedLine({
  text,
  speed,
  index,
  progress,
}: LineConfig & { index: number; progress: MotionValue<number> }) {
  const direction = index % 2 === 0 ? 1 : -1;
  const copies = Array.from({ length: 4 }, () => text).join("  •  ");
  const x = useTransform(
    progress,
    [0, 1],
    [`${direction * speed}%`, `${direction * -speed}%`],
  );

  return (
    <div className="overflow-hidden">
      <motion.p
        style={{ x }}
        className="whitespace-nowrap text-2xl md:text-4xl font-semibold tracking-tight"
      >
        {copies}
      </motion.p>
    </div>
  );
}

export default function InspirationalTextLines() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={sectionRef} className="relative h-[95vh] md:h-[115vh]">
      <div className="sticky top-0 h-screen rounded-2xl bg-brand-blue-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.1),transparent_42%)]" />
        <div className="relative z-10 h-full flex flex-col justify-center gap-8 px-6 md:px-10">
          <div className="space-y-2">
            <p className="text-white/75 text-sm md:text-base uppercase tracking-[0.2em]">
              Your Reset Starts Here
            </p>
            <h3 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
              Una pausa real para volver con energía, claridad y foco.
            </h3>
          </div>

          <div className="space-y-3 md:space-y-4">
            {shouldReduceMotion
              ? LINES.map((line) => (
                  <p
                    key={line.text}
                    className="text-2xl md:text-4xl font-semibold tracking-tight"
                  >
                    {line.text}
                  </p>
                ))
              : LINES.map((line, index) => (
                  <AnimatedLine
                    key={line.text}
                    {...line}
                    index={index}
                    progress={scrollYProgress}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
