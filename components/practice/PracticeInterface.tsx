"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Check, X, ArrowRight, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import PracticeResult from "./PracticeResult";
import PracticeStats from "./PracticeStats";
import { incrementCorrectAnswersCount } from "@/lib/actions/words";
import { LanguageCodeType, PracticeVocabularyWord } from "@/types";
import { useRouter } from "next/navigation";

interface PracticeInterfaceProps {
  vocabulary: PracticeVocabularyWord[];
  language: LanguageCodeType;
}

const PracticeInterface = ({
  vocabulary,
  language,
}: PracticeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    total: vocabulary.length,
  });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentWord = vocabulary[currentIndex];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const checkAnswer = async () => {
    const isAnswerCorrect =
      userInput.trim().toLowerCase() === currentWord.translation.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));

      await incrementCorrectAnswersCount({
        recordId: currentWord.recordId,
        language,
      });
    } else {
      setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleSkipWord = () => {
    setShowAnswer(true);
    setIsCorrect(null);
    setStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
  };

  const handleNextWord = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setShowAnswer(false);
      setIsCorrect(null);
    } else {
      setPracticeComplete(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showAnswer) {
      checkAnswer();
    } else if (e.key === "Enter" && showAnswer) {
      handleNextWord();
    }
  };

  const restartPractice = () => {
    setCurrentIndex(0);
    setUserInput("");
    setShowAnswer(false);
    setIsCorrect(null);
    setPracticeComplete(false);
    setStats({
      correct: 0,
      incorrect: 0,
      skipped: 0,
      total: vocabulary.length,
    });
  };

  const completePractice = () => {
    router.push("/practice");
  };

  if (practiceComplete) {
    return (
      <PracticeResult
        stats={stats}
        onRestart={restartPractice}
        onComplete={completePractice}
      />
    );
  }

  const progress =
    ((currentIndex + (showAnswer ? 1 : 0)) / vocabulary.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Word {currentIndex + 1} of {vocabulary.length}
        </div>
        <PracticeStats stats={stats} />
      </div>

      <Progress
        value={progress}
        className="h-2"
      />

      <Card className="border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="text-2xl font-bold text-gray-900">
              {currentWord.word}
            </div>
            <div className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              {currentWord.type}
            </div>

            <div className="w-full max-w-md mt-4">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Translate to {language}:
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  id="translation"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  disabled={showAnswer}
                  placeholder="Type the translation..."
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    showAnswer
                      ? isCorrect
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                />
                {showAnswer && (
                  <div className="absolute right-3 top-3">
                    {isCorrect ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <X className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {showAnswer && (
              <div
                className={`text-center p-4 rounded-lg w-full max-w-md ${
                  isCorrect
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                {!isCorrect && (
                  <p className="mt-2">
                    The correct translation is:{" "}
                    <span className="font-bold">{currentWord.translation}</span>
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-4 w-full max-w-md">
              {!showAnswer ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSkipWord}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Show Answer
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={checkAnswer}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Check
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleNextWord}
                >
                  {currentIndex < vocabulary.length - 1 ? (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Next Word
                    </>
                  ) : (
                    "Complete Practice"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeInterface;
