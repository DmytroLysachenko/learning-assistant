"use client";

import { useState } from "react";

interface AddToVocabularyButtonProps {
  wordId: string;
  language: string;
  handleAddToVocabulary: (wordId: string, language: string) => void;
  label?: string;
}

const AddToVocabularyButton = ({
  wordId,
  language,
  label,
  handleAddToVocabulary,
}: AddToVocabularyButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate default label if not provided
  const buttonLabel = label || `Add ${language.slice(0, 2).toUpperCase()}`;

  const handleClick = async () => {
    setIsLoading(true);

    await handleAddToVocabulary(wordId, language);

    // Mock success
    setIsAdded(true);
    setIsLoading(false);

    console.log(`Added ${language} word with ID ${wordId} to vocabulary`);

    // Reset after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
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
