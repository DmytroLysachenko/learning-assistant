import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorksSection";
import CtaSection from "@/components/home/CtaSection";
import FuturePlans from "@/components/home/FuturePlansSction";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Language Assistant - AI-Powered Language Learning",
  description:
    "Learn languages faster and more effectively with our AI-powered language assistant.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <FuturePlans />
        <CtaSection />
      </main>
    </>
  );
}
