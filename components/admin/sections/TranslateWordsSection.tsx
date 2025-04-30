"use client";

import { toast } from "sonner";
import type { LanguageCodeType, WordType } from "@/types";
import { translateWordsToLanguage } from "@/lib/actions/admin/translateWordsToLanguage";
import TranslateWordsForm from "../forms/TranslateWordsForm";

interface GenerationByAlphabetSectionProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const TranslateWordsSection = ({
  isGenerating,
  setIsGenerating,
}: GenerationByAlphabetSectionProps) => {
  const handleTranslateWords = async ({
    batchSize,
    wordType,
    delay,
    sourceLanguage,
    targetLanguage,
  }: {
    batchSize: number;
    wordType: WordType;
    delay: number;
    sourceLanguage: LanguageCodeType;
    targetLanguage: LanguageCodeType;
  }) => {
    try {
      setIsGenerating(true);

      const { success } = await translateWordsToLanguage({
        sourceLanguage,
        targetLanguage,
        batchSize,
        wordType: wordType,
        delayMs: delay,
      });

      if (!success) {
        toast.error("Failed to generate translation words");
        return;
      }

      toast.success("Words generated alphabetically", {
        description: `Successfully generated translated words in ${targetLanguage.toUpperCase()} language`,
      });
    } catch (error) {
      toast.error("Failed to generate translation words", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <TranslateWordsForm
        isGenerating={isGenerating}
        onGenerate={handleTranslateWords}
      />
    </div>
  );
};

export default TranslateWordsSection;
