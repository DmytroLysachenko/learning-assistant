"use client";

import { CheckCircle, XCircle, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PracticeResultProps {
  stats: {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
  };
  onRestart: () => void;
}
const PracticeResult = ({ stats, onRestart }: PracticeResultProps) => {
  const correctPercentage =
    Math.round((stats.correct / stats.total) * 100) || 0;

  let message = "";
  let messageClass = "";

  if (correctPercentage >= 90) {
    message = "Excellent! You're mastering these words!";
    messageClass = "text-green-600";
  } else if (correctPercentage >= 70) {
    message = "Great job! Keep practicing to improve further.";
    messageClass = "text-green-600";
  } else if (correctPercentage >= 50) {
    message = "Good effort! Regular practice will help you improve.";
    messageClass = "text-yellow-600";
  } else {
    message = "Keep practicing! These words need more review.";
    messageClass = "text-red-600";
  }

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <h2 className="text-2xl font-bold text-gray-900">Practice Complete!</h2>

      <p className={`text-lg font-medium ${messageClass}`}>{message}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
        <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-700">
            {stats.correct}
          </div>
          <div className="text-sm text-green-600">Correct</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center">
          <XCircle className="h-8 w-8 text-red-500 mb-2" />
          <div className="text-2xl font-bold text-red-700">
            {stats.incorrect}
          </div>
          <div className="text-sm text-red-600">Incorrect</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          <HelpCircle className="h-8 w-8 text-gray-500 mb-2" />
          <div className="text-2xl font-bold text-gray-700">
            {stats.skipped}
          </div>
          <div className="text-sm text-gray-600">Skipped</div>
        </div>
      </div>

      <div className="text-center mt-4">
        <div className="text-4xl font-bold text-purple-600 mb-2">
          {correctPercentage}%
        </div>
        <div className="text-sm text-gray-500">
          {stats.correct} of {stats.total} words correct
        </div>
      </div>

      <Button
        onClick={onRestart}
        className="mt-6 bg-purple-600 hover:bg-purple-700"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Practice Again
      </Button>
    </div>
  );
};

export default PracticeResult;
