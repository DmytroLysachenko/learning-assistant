"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import { ArrowRight, Languages, Sparkles, Brain } from "lucide-react";

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
                AI-Powered Learning
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              Master Any Language with{" "}
              <span className="text-gradient gradient-primary">
                AI Assistance
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground md:text-xl"
            >
              Learn languages faster and more effectively with personalized
              lessons, real-time feedback, and adaptive learning powered by
              artificial intelligence.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 btn-glow group"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                How It Works
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                <span className="level-indicator level-beginner">Beginner</span>
                <span className="level-indicator level-intermediate">
                  Intermediate
                </span>
                <span className="level-indicator level-advanced">Advanced</span>
              </div>
              <span>All proficiency levels supported</span>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative mx-auto aspect-square w-full max-w-md rounded-lg md:order-last"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg"></div>
            <div className="glass absolute -top-6 -left-6 flex items-center gap-2 rounded-lg p-3 shadow-lg">
              <Languages className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm font-medium">30+ Languages</div>
                <div className="text-xs text-muted-foreground">
                  Learn any language
                </div>
              </div>
            </div>
            <div className="glass absolute -bottom-6 -right-6 flex items-center gap-2 rounded-lg p-3 shadow-lg">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm font-medium">Adaptive Learning</div>
                <div className="text-xs text-muted-foreground">
                  Personalized for you
                </div>
              </div>
            </div>
            <Image
              src="/images/hero-image.jpg"
              alt="Language learning illustration"
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
