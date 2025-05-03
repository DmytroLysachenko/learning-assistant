"use client";

import { toast } from "sonner";

import { validateVocabulary } from "@/lib/actions/checks/vocabulary";
import ValidationForm from "../forms/ValidationForm";
import type { LanguageCodeType, WordType } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/constants";

interface ValidationProps {
  isValidating: boolean;
  setIsValidating: (value: boolean) => void;
}
const ValidationPanel = ({
  isValidating,
  setIsValidating,
}: ValidationProps) => {
  const handleValidateVocabulary = async ({
    language,
    wordType,
    batchSize,
  }: {
    language: LanguageCodeType;
    wordType: WordType;
    batchSize: number;
  }) => {
    try {
      setIsValidating(true);

      await validateVocabulary({ language, wordType, batchSize });

      toast.success("Validation completed", {
        description: `Successfully validated ${wordType} words for ${SUPPORTED_LANGUAGES[language]} language`,
      });
    } catch (error) {
      toast.error("Validation failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full">
      <ValidationForm
        isValidating={isValidating}
        onValidate={handleValidateVocabulary}
      />
    </div>
  );
};

export default ValidationPanel;
