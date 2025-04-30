"use client";
import { toast } from "sonner";
import type { LanguageCodeType, LanguageLevelsType, WordType } from "@/types";
import { seedWordsByTopic } from "@/lib/actions/admin/seedWordsByTopic";
import TopicGenerationForm from "../forms/GenerationByTopicForm";

interface GenerationByTopicSectionProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const GenerationByTopicSection = ({
  isGenerating,
  setIsGenerating,
}: GenerationByTopicSectionProps) => {
  const handleGenerateWords = async ({
    level,
    total,
    batchSize,
    delay,
    wordType,
    language,
  }: {
    level: LanguageLevelsType;
    total: number;
    batchSize: number;
    delay: number;
    wordType: WordType;
    language: LanguageCodeType;
  }) => {
    try {
      setIsGenerating(true);

      await seedWordsByTopic({
        total,
        batchSize,
        wordType: wordType,
        delayMs: delay,
        level: level,
        language,
      });

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
        isGenerating={isGenerating}
        onGenerate={handleGenerateWords}
      />
    </div>
  );
};

export default GenerationByTopicSection;
