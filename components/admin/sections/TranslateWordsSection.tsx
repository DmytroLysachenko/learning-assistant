"use client";

import { toast } from "sonner";

import type { LanguageCodeType } from "@/types";
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
    delay,
    sourceLanguage,
    targetLanguage,
  }: {
    batchSize: number;
    delay: number;
    sourceLanguage: LanguageCodeType;
    targetLanguage: LanguageCodeType;
  }) => {
    try {
      setIsGenerating(true);

      const { success, error, data } = await translateWordsToLanguage({
        sourceLanguage,
        targetLanguage,
        batchSize,
        delayMs: delay,
      });

      if (success) {
        toast.success("Words translated successfully", {
          description: `Translated ${
            data ?? "some"
          } words into ${targetLanguage.toUpperCase()}.`,
        });
      } else {
        toast.error("Failed to translate words", {
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    } catch (error) {
      toast.error("Unexpected error during translation", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      console.error(error);
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
