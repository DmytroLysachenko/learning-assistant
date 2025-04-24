"use client";

import { useState } from "react";
import { toast } from "sonner";
import { validateVocabulary } from "@/lib/actions/checks/vocabulary";
import ValidationForm from "../forms/ValidationForm";

import type { WordType } from "@/types";

interface ValidationProps {
  isValidating: boolean;
  setIsValidating: (value: boolean) => void;
}
const ValidationPanel = ({
  isValidating,
  setIsValidating,
}: ValidationProps) => {
  const [language, setLanguage] = useState<"pl" | "ru">("pl");
  const [wordType, setWordType] = useState<WordType | "none">("none");

  const handleValidateVocabulary = async () => {
    if (wordType === "none") {
      toast.error("Please select a word type for validation");
      return;
    }

    try {
      setIsValidating(true);

      await validateVocabulary(language, wordType as WordType);

      toast.success("Validation completed", {
        description: `Successfully validated ${wordType} words for ${
          language === "pl" ? "Polish" : "Russian"
        } language`,
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
        language={language}
        wordType={wordType}
        setLanguage={setLanguage}
        setWordType={setWordType}
        onValidate={handleValidateVocabulary}
      />
    </div>
  );
};

export default ValidationPanel;
