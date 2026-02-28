"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Title from "@/components/ui/Title";

interface RetreatHeroProps {
  title: string;
  location: string;
  date: string;
  imageUrl: string;
}

export default function RetreatHero({
  title,
  location,
  date,
  imageUrl,
}: RetreatHeroProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.9]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.92, 0.5]);
  const contentScale = useTransform(scrollYProgress, [0, 0.88], [1, 1.7]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0vh", "2vh"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.9]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const mediaFilter = useTransform(blur, (value) => `blur(${value.toFixed(2)}px)`);
  const lightOverlayOpacity = useTransform(scrollYProgress, [0.72, 1], [0, 1]);
  const arrowOpacity = useTransform(scrollYProgress, [0.68, 0.82, 1], [0, 1, 0.55]);
  const titleColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(255, 255, 255)", "rgb(15, 23, 42)"],
  );
  const subtitleColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.9)", "rgba(15, 23, 42, 0.9)"],
  );
  const dotColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(255, 255, 255)", "rgb(15, 23, 42)"],
  );

  return (
    <div ref={heroRef} className="relative h-[185vh] md:h-[205vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gray/20"
          style={
            shouldReduceMotion
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.52)), url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.52)), url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  scale: mediaScale,
                  opacity: mediaOpacity,
                  filter: mediaFilter,
                }
          }
        />
        <div className="absolute inset-0 bg-black/15" />
        <motion.div
          className="absolute inset-0 bg-[#FAF8F4]"
          style={{ opacity: lightOverlayOpacity }}
        />
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{ opacity: shouldReduceMotion ? 0 : arrowOpacity }}
          animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <div className="flex flex-col items-center gap-1 text-black/80">
            <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
            <span className="text-2xl leading-none">↓</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4 md:px-12"
          style={
            shouldReduceMotion
              ? undefined
              : { scale: contentScale, y: contentY, opacity: contentOpacity }
          }
        >
          <div className="absolute top-6 md:top-8 left-4 right-4 md:left-12 md:right-12 z-20">
            <div className="max-w-6xl mx-auto">
              <Link
                href="/#retreats"
                className="text-white/80 hover:text-white text-sm block"
              >
                &larr; Volver a Retiros
              </Link>
            </div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
            <motion.div style={{ color: shouldReduceMotion ? "#ffffff" : titleColor }}>
              <Title className="text-5xl md:text-8xl text-inherit mb-3">{title}</Title>
            </motion.div>
            <motion.p
              style={{ color: shouldReduceMotion ? "rgba(255, 255, 255, 0.9)" : subtitleColor }}
              className="text-xl md:text-2xl flex items-center justify-center gap-2"
            >
              <span>{location}</span>
              <motion.span
                style={{ backgroundColor: shouldReduceMotion ? "#ffffff" : dotColor }}
                className="w-1 h-1 rounded-full"
              />
              <span>{date}</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
