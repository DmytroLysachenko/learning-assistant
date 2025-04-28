"use client";

import { addWordToVocabulary } from "@/lib/actions/words";
import { LanguageCodeType } from "@/types";
import { useState } from "react";

interface AddToVocabularyButtonProps {
  wordId: string;
  userId: string;
  language: LanguageCodeType;
  isAdded?: boolean;
  label?: string;
}

const AddToVocabularyButton = ({
  wordId,
  userId,
  language,
  isAdded: isAddedProp = false,
  label,
}: AddToVocabularyButtonProps) => {
  const [isAdded, setIsAdded] = useState(isAddedProp);
  const [isLoading, setIsLoading] = useState(false);
  // Generate default label if not provided
  const buttonLabel = label || `Add ${language.slice(0, 2).toUpperCase()}`;
  // console.log(isAdded);
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await addWordToVocabulary({ wordId, userId, language });
      console.log("Word added to vocabulary");
      setIsAdded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isAdded}
      className={`
        px-3 py-1 rounded-md transition-colors text-sm font-medium
        ${
          isAdded
            ? "bg-green-100 text-green-800"
            : isLoading
            ? "bg-gray-100 text-gray-500"
            : "bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-900"
        }
      `}
    >
      {isAdded ? "Added ✓" : isLoading ? "Adding..." : buttonLabel}
    </button>
  );
};

export default AddToVocabularyButton;
