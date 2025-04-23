"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Headphones,
  PenTool,
  BookOpen,
  BarChart4,
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
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI-Powered Learning",
      description:
        "Our advanced AI adapts to your learning style and pace, creating a personalized experience that helps you learn faster.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Conversation Practice",
      description:
        "Practice real conversations with our AI language partner that provides instant feedback on pronunciation and grammar.",
    },
    {
      icon: <Headphones className="h-10 w-10 text-primary" />,
      title: "Listening Comprehension",
      description:
        "Improve your listening skills with audio exercises tailored to your proficiency level and interests.",
    },
    {
      icon: <PenTool className="h-10 w-10 text-primary" />,
      title: "Writing Assistant",
      description:
        "Get real-time corrections and suggestions as you write in your target language to improve your writing skills.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Vocabulary Builder",
      description:
        "Build your vocabulary with smart flashcards that use spaced repetition to help you remember words effectively.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: "Progress Tracking",
      description:
        "Track your progress with detailed analytics and insights to see how your language skills are improving over time.",
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
            Powerful Features for{" "}
            <span className="text-gradient gradient-primary">
              Effective Learning
            </span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Our language assistant combines cutting-edge AI technology with
            proven language learning methods to help you achieve fluency faster.
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
