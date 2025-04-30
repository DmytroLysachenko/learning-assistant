"use client";

import { toast } from "sonner";
import type { LanguageCodeType, WordType } from "@/types";
import { seedWordsByAlphabet } from "@/lib/actions/admin/seedWordsByAlphabet";
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
  }: {
    total: number;
    batchSize: number;
    wordType: WordType;
    delay: number;
    language: LanguageCodeType;
  }) => {
    try {
      setIsGenerating(true);

      const {
        success,
        error,
        data: totalGenerated,
      } = await seedWordsByAlphabet({
        total,
        batchSize,
        wordType: wordType,
        delayMs: delay,
        language,
      });

      if (success) {
        toast.success("Words generated alphabetically", {
          description: `Successfully generated ${totalGenerated} words for language: ${language.toUpperCase()}`,
        });
      } else {
        toast.error("Failed to generate words", {
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    } catch (error) {
      toast.error("Unexpected error during generation");
      console.error(error);
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
