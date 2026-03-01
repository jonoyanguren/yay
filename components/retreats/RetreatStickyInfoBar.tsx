"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Button from "@/components/ui/Button";

interface RetreatStickyInfoBarProps {
  date: string;
  location: string;
  maxPeople: number;
  spotsLeft: number;
  bookingHref: string;
  disableSticky?: boolean;
}

export default function RetreatStickyInfoBar({
  date,
  location,
  maxPeople,
  spotsLeft,
  bookingHref,
  disableSticky = false,
}: RetreatStickyInfoBarProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isPinned, setIsPinned] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 18%", "start 0%"],
  });

  const morphProgress = useTransform(scrollYProgress, [0.82, 1], [0, 1]);
  const smoothMorph = useSpring(morphProgress, {
    stiffness: 65,
    damping: 26,
    mass: 1.2,
  });

  const paddingY = useTransform(smoothMorph, [0, 1], ["20px", "10px"]);
  const paddingX = useTransform(smoothMorph, [0, 1], ["20px", "14px"]);
  const radius = useTransform(smoothMorph, [0, 1], ["18px", "0px"]);
  const shadow = useTransform(
    smoothMorph,
    [0, 1],
    ["0 10px 30px rgba(0,0,0,0.08)", "0 6px 18px rgba(0,0,0,0.12)"],
  );
  const contentMaxWidth = useTransform(smoothMorph, [0, 1], ["72rem", "100vw"]);
  const contentPaddingX = useTransform(smoothMorph, [0, 1], ["0px", "14px"]);

  useEffect(() => {
    if (disableSticky) return;

    const onScroll = () => {
      const node = sectionRef.current;
      if (!node) return;
      setIsPinned(node.getBoundingClientRect().top <= 0);
    };

    const onResize = () => {
      const barNode = barRef.current;
      if (!barNode) return;
      setBarHeight(barNode.getBoundingClientRect().height);
    };

    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [disableSticky]);

  const isStickyActive = !disableSticky && isPinned;
  const canMorph = !shouldReduceMotion && !disableSticky;

  return (
    <section
      ref={sectionRef}
      className="relative z-40 -mt-1"
      style={isStickyActive ? { height: `${barHeight}px` } : undefined}
    >
      <motion.div
        ref={barRef}
        className={
          isStickyActive
            ? "fixed top-0 left-0 right-0 z-50 bg-sand-light/95 backdrop-blur border-b border-black/10"
            : "relative mx-auto max-w-6xl bg-sand-light border border-black/10"
        }
        animate={
          !canMorph
            ? undefined
            : undefined
        }
        style={
          !canMorph
            ? undefined
            : {
                paddingTop: paddingY,
                paddingBottom: paddingY,
                paddingLeft: paddingX,
                paddingRight: paddingX,
                borderRadius: radius,
                boxShadow: shadow,
              }
        }
        transition={{
          type: "spring",
          stiffness: 115,
          damping: 24,
          mass: 0.9,
        }}
      >
        <motion.div
          className="mx-auto"
          style={
            !canMorph
              ? { maxWidth: "72rem" }
              : {
                  maxWidth: contentMaxWidth,
                  paddingLeft: contentPaddingX,
                  paddingRight: contentPaddingX,
                }
          }
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg border border-gray/15 bg-white px-3 py-2">
                <p className="text-black/55 text-xs uppercase tracking-wide">Fechas</p>
                <p className="font-medium">{date}</p>
              </div>
              <div className="rounded-lg border border-gray/15 bg-white px-3 py-2">
                <p className="text-black/55 text-xs uppercase tracking-wide">Ubicación</p>
                <p className="font-medium">{location}</p>
              </div>
              <div className="rounded-lg border border-gray/15 bg-white px-3 py-2">
                <p className="text-black/55 text-xs uppercase tracking-wide">Grupo</p>
                <p className="font-medium">Max {maxPeople} personas</p>
              </div>
              <div className="rounded-lg border border-gray/15 bg-white px-3 py-2">
                <p className="text-black/55 text-xs uppercase tracking-wide">Plazas</p>
                <p className="font-medium">
                  Quedan {spotsLeft} de {maxPeople} plazas
                </p>
              </div>
            </div>

            <Button className="w-full md:w-auto" size="lg" href={bookingHref}>
              Reservar plaza
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
