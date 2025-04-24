"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { LanguageCodeType, LanguageLevelsType, WordType } from "@/types";
import { seedWordsByTopic } from "@/lib/actions/admin";
import { removeDuplicatesFromTable } from "@/lib/actions/checks/vocabulary";
import TopicGenerationForm from "../forms/TopicGenerationForm";

interface GenerationByTopicSectionProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const GenerationByTopicSection = ({
  isGenerating,
  setIsGenerating,
}: GenerationByTopicSectionProps) => {
  // State for form values
  const [level, setLevel] = useState<LanguageLevelsType | "random">("random");
  const [total, setTotal] = useState(10);
  const [batchSize, setBatchSize] = useState(50);
  const [delay, setDelay] = useState(5000);
  const [wordType, setWordType] = useState<WordType | "none">("none");
  const [language, setLanguage] = useState<LanguageCodeType>("pl");
  const [translationLanguage, setTranslationLanguage] =
    useState<LanguageCodeType>("ru");

  const handleGenerateWords = async () => {
    try {
      setIsGenerating(true);

      await seedWordsByTopic({
        total: total,
        batchSize,
        wordType: wordType === "none" ? undefined : wordType,
        delayMs: delay,
        level: level === "random" ? undefined : level,
        language,
        translationLanguage,
      });

      // Clean up duplicates after generation
      await removeDuplicatesFromTable(language);
      await removeDuplicatesFromTable(translationLanguage);

      toast.success("Words generated successfully", {
        description: `Added ${total} words at level ${level} and removed duplicates.`,
      });
    } catch (error) {
      toast.error("Failed to generate words", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <TopicGenerationForm
        isDisabled={isGenerating}
        level={level}
        total={total}
        batchSize={batchSize}
        delay={delay}
        wordType={wordType}
        language={language}
        translationLanguage={translationLanguage}
        setLevel={setLevel}
        setTotal={setTotal}
        setBatchSize={setBatchSize}
        setDelay={setDelay}
        setWordType={setWordType}
        setLanguage={setLanguage}
        setTranslationLanguage={setTranslationLanguage}
        onGenerate={handleGenerateWords}
      />
    </div>
  );
};

export default GenerationByTopicSection;
