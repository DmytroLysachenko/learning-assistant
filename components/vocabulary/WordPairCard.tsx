"use client";
import type { Word, WordPair } from "@/types";
import AddToVocabularyButton from "./AddToVocabularyButton";
import { SUPPORTED_LANGUAGES } from "@/constants";

interface WordPairCardProps {
  pair: WordPair;
  userId: string;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  isUserVocabulary?: boolean;
}

const WordPairCard = ({
  pair,
  userId,
  expandedId,
  onToggleExpand,
  isUserVocabulary,
}: WordPairCardProps) => {
  const { primaryWord, secondaryWord } = pair;
  const isExpanded = expandedId === pair.id;

  if (!primaryWord || !secondaryWord) return null;

  return (
    <div className="border rounded-lg  bg-white hover:shadow-md transition-shadow relative">
      <div
        className="p-4 cursor-pointer"
        onClick={() => onToggleExpand(pair.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-medium text-gray-900">
              {primaryWord.word}
            </div>
            <div className="text-md text-gray-500">{secondaryWord.word}</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mt-1">
              {primaryWord.type}
            </span>
          </div>
        </div>

        {!isUserVocabulary && (
          <div className="mt-3">
            <AddToVocabularyButton
              wordId={primaryWord.id}
              userId={userId}
              isAdded={pair.isLearning}
              language={primaryWord.language}
              label={`Add to my vocabulary`}
            />
          </div>
        )}

        {/* Expand/collapse indicator */}
        <div className="text-center mt-4 text-gray-400">
          {isExpanded ? "▲ Less details" : "▼ More details"}
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && <WordDetails words={[primaryWord, secondaryWord]} />}
    </div>
  );
};

interface WordDetailsProps {
  words: Word[];
}

const WordDetails = ({ words }: WordDetailsProps) => {
  return (
    <div className="p-4 border rounded-xl bg-gray-50 absolute -left-[2%] top-[104%] w-[104%] z-10 shadow-xl">
      <div className="grid grid-cols-1 gap-4">
        {words.map(({ id, language, type, example, comment }) => (
          <div
            key={id}
            className="space-y-2"
          >
            <h4 className="font-medium text-gray-900 capitalize">
              {SUPPORTED_LANGUAGES[language]}
            </h4>
            <div className="flex justify-between">
              <div className="text-gray-500">Type:</div>
              <div>{type}</div>
            </div>

            {example && (
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-500">
                  Example:
                </span>
                <p className="text-sm text-gray-700 italic mt-1 p-2 bg-white rounded border">
                  {example}
                </p>
              </div>
            )}

            {comment && (
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-500">
                  Comment:
                </span>
                <p className="text-sm text-gray-700 mt-1 p-2 bg-white rounded border">
                  {comment}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordPairCard;
