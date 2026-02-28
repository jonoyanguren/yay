"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeInOnViewProps {
  children: ReactNode;
  delay?: number;
}

export default function FadeInOnView({
  children,
  delay = 0,
}: FadeInOnViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
