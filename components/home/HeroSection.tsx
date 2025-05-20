"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import { ArrowRight, Languages, Sparkles, Landmark } from "lucide-react";

import AnimatedGradient from "@/components/ui/animated-gradient";

const HeroSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className=" relative overflow-hidden py-20 md:py-32">
      <AnimatedGradient />

      <div className=" container mx-auto px-5 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid gap-8 md:grid-cols-2 md:gap-12 items-center"
        >
          <div className="flex flex-col gap-6">
            <motion.div
              variants={itemVariants}
              className="flex gap-2"
            >
              <span className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium">
                <Sparkles className="mr-1 h-3.5 w-3.5 text-primary" />
                Focused Vocabulary Building
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              Master Your{" "}
              <span className="text-gradient gradient-primary">
                Polish Vocabulary
              </span>{" "}
              from the Start
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground md:text-xl"
            >
              Begin your Polish language journey by building a strong core
              vocabulary. Our app helps you learn essential words and practice
              them with an intuitive, interactive interface.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 btn-glow group"
              >
                Start Learning Polish Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Explore Features
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                <span className="level-indicator level-beginner">Beginner</span>
                <span className="level-indicator level-intermediate">
                  Core Vocabulary
                </span>
                <span className="level-indicator level-advanced">
                  Practice Ready
                </span>
              </div>
              <span>Perfect for beginners and those building a solid base</span>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative mx-auto aspect-square w-full max-w-md rounded-lg md:order-last"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg"></div>
            <div className="glass absolute -top-6 -left-6 flex items-center gap-2 rounded-lg p-3 shadow-lg">
              <Landmark className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm font-medium">Polish Focus</div>
                <div className="text-xs text-muted-foreground">
                  Start with essential Polish
                </div>
              </div>
            </div>
            <div className="glass absolute -bottom-6 -right-6 flex items-center gap-2 rounded-lg p-3 shadow-lg">
              <Languages className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm font-medium">Future Languages</div>
                <div className="text-xs text-muted-foreground">
                  Spanish, Russian & more coming!
                </div>
              </div>
            </div>
            <Image
              src="/images/hero-image.jpg"
              alt="Learning Polish vocabulary"
              width={600}
              height={600}
              className="relative -z-1 rounded-lg object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
