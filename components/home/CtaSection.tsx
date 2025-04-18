"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20">
      <div>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-purple-600 px-6 py-16 md:px-12 md:py-24"
        >
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              Ready to Start Your Language Journey?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-xl text-white/80"
            >
              Join thousands of learners who are already improving their
              language skills with our AI assistant.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-medium text-primary transition-all hover:bg-white/90 btn-glow group"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-3 text-base font-medium text-white transition-colors hover:bg-white/20"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-8 text-sm text-white/60"
            >
              No credit card required. Start with our free plan today.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
