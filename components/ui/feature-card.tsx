"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="font-heading text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-full"></div>
    </motion.div>
  );
}
