"use client";

import { toast } from "sonner";
import type { LanguageCodeType, WordType } from "@/types";
import { seedWordsByAlphabet } from "@/lib/actions/admin";
import AlphabetGenerationForm from "../forms/GenerationByAlphabetForm";

interface GenerationByAlphabetSectionProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const GenerationByAlphabetSection = ({
  isGenerating,
  setIsGenerating,
}: GenerationByAlphabetSectionProps) => {
  const handleGenerateWords = async ({
    total,
    batchSize,
    wordType,
    delay,
    language,
    translationLanguage,
  }: {
    total: number;
    batchSize: number;
    wordType: WordType | "none";
    delay: number;
    language: LanguageCodeType;
    translationLanguage: LanguageCodeType;
  }) => {
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
        isGenerating={isGenerating}
        onGenerate={handleGenerateWords}
      />
    </div>
  );
};

export default GenerationByAlphabetSection;
