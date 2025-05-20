"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Target,
  Headphones,
  Keyboard,
  ListTodo,
  CheckCircle,
} from "lucide-react";

import FeatureCard from "@/components/ui/feature-card";

const FeaturesSection = () => {
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

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Core Polish Vocabulary",
      description:
        "Expand your knowledge with essential Polish words and phrases, carefully curated to build a strong foundation.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Focused Vocabulary Building",
      description:
        "Master vocabulary from our main Polish vocabulary list, ensuring you learn the most relevant words first.",
    },
    {
      icon: <Headphones className="h-10 w-10 text-primary" />,
      title: "Pronunciation Practice",
      description:
        "Hear native pronunciations for each word and refine your own speaking skills to sound more natural.",
    },
    {
      icon: <Keyboard className="h-10 w-10 text-primary" />,
      title: "Interactive Practice",
      description:
        "Engage in hands-on practice by typing the words as they appear, reinforcing your spelling and recall.",
    },
    {
      icon: <ListTodo className="h-10 w-10 text-primary" />,
      title: "Personalized Word Lists",
      description:
        "Build your own vocabulary list based on the words you've learned, making it easy to review and track your progress.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Progress Overview",
      description:
        "Monitor your learning journey and see how your vocabulary grows as you master new Polish words.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Boost Your{" "}
            <span className="text-gradient gradient-primary">
              Polish Vocabulary
            </span>{" "}
            Effectively
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Our app is designed to help you rapidly expand your Polish
            vocabulary and reinforce learning through engaging practice.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
