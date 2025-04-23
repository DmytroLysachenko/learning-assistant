"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Globe,
  Users,
  Lightbulb,
  Smartphone,
} from "lucide-react";

const FuturePlans = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const roadmapItems = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Advanced AI Conversation",
      description:
        "We're enhancing our AI to handle more complex conversations and cultural nuances.",
      quarter: "Q3 2023",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "More Languages",
      description:
        "Expanding our language offerings to include less common but important languages.",
      quarter: "Q4 2023",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Features",
      description:
        "Connect with other learners for practice sessions and language exchange.",
      quarter: "Q1 2024",
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Immersive Learning",
      description:
        "Virtual reality experiences for immersive language practice in realistic scenarios.",
      quarter: "Q2 2024",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile App",
      description:
        "Native mobile applications for iOS and Android with offline learning capabilities.",
      quarter: "Q3 2024",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Certification Program",
      description:
        "Official language proficiency certification recognized by educational institutions.",
      quarter: "Q4 2024",
    },
  ];

  return (
    <section
      id="roadmap"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Our <span className="text-gradient gradient-primary">Roadmap</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re constantly improving our language assistant. Here&apos;s
            what we&apos;re working on for the future.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative rounded-xl border bg-background p-6 shadow-sm"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                <Calendar className="h-3 w-3" />
                {item.quarter}
              </div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FuturePlans;
