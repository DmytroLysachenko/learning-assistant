"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { LanguageCodeType, WordType } from "@/types";
import { seedWordsByAlphabet } from "@/lib/actions/admin";
import AlphabetGenerationForm from "../forms/AlphabetGenerationForm";

interface GenerationBaseProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const GenerationByAlphabet = ({
  isGenerating,
  setIsGenerating,
}: GenerationBaseProps) => {
  // State for form values
  const [batchSize, setBatchSize] = useState(50);
  const [delay, setDelay] = useState(5000);
  const [wordType, setWordType] = useState<WordType | "none">("none");
  const [language, setLanguage] = useState<LanguageCodeType>("pl");
  const [translationLanguage, setTranslationLanguage] =
    useState<LanguageCodeType>("ru");
  const [total, setTotal] = useState(100);

  const handleGenerateWords = async () => {
    try {
      setIsGenerating(true);

      const { success } = await seedWordsByAlphabet({
        total,
        batchSize,
        wordType: wordType === "none" ? undefined : wordType,
        delayMs: delay,
        language,
        translationLanguage,
      });

      if (!success) {
        toast.error("Failed to generate words alphabetically");
        return;
      }

      toast.success("Words generated alphabetically", {
        description: `Successfully generated words for language: ${language.toUpperCase()}`,
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
      <AlphabetGenerationForm
        isDisabled={isGenerating}
        batchSize={batchSize}
        delay={delay}
        wordType={wordType}
        language={language}
        translationLanguage={translationLanguage}
        total={total}
        setBatchSize={setBatchSize}
        setDelay={setDelay}
        setWordType={setWordType}
        setLanguage={setLanguage}
        setTranslationLanguage={setTranslationLanguage}
        setTotal={setTotal}
        onGenerate={handleGenerateWords}
      />
    </div>
  );
};

export default GenerationByAlphabet;
