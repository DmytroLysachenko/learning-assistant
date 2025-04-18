"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 },
    },
  };

  const steps = [
    {
      title: "Create your account",
      description:
        "Sign up and tell us which language you want to learn and your current proficiency level.",
    },
    {
      title: "Take the assessment",
      description:
        "Complete a quick assessment so we can personalize your learning experience.",
    },
    {
      title: "Start learning",
      description:
        "Begin your personalized lessons and practice with our AI language partner.",
    },
    {
      title: "Track your progress",
      description:
        "Monitor your improvement and adjust your learning goals as you advance.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20"
    >
      <div>
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How <span className="text-gradient gradient-primary">It Works</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Getting started with our language assistant is easy. Follow these
            simple steps to begin your language learning journey.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative mx-auto aspect-video w-full max-w-md rounded-xl overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Language learning app interface"
              width={800}
              height={600}
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="progress-container">
                <div
                  className="progress-bar bg-gradient-to-r from-green-500 to-blue-500"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-white">
                Your Spanish journey: 65% to next level
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
