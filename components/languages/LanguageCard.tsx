"use client";

import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user";

interface Language {
  code: string;
  wordCount: number;
  name: string;
  isLearning: boolean;
}

interface LanguageCardProps {
  language: Language;
  userId: string;
}

const LanguageCard = ({ language, userId }: LanguageCardProps) => {
  const { code, wordCount, isLearning, name } = language;

  const onToggleLearning = async () => {
    await updateUser(userId, { learningLanguages: isLearning ? [] : [code] });
  };

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all",
        isLearning ? "border-purple-300" : "hover:border-purple-300",
        "h-full relative"
      )}
    >
      {isLearning && (
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
      )}

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <h2 className="font-semibold text-lg text-gray-900">{name}</h2>
          </div>
          {isLearning && (
            <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
              Learning
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="mb-5">
            <span className="text-sm text-gray-600">
              {isLearning
                ? `You are currently learning ${name}. Practice to improve your skills.`
                : `Add ${name} to your learning languages to start practicing.`}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Available words</span>
              <span className="text-sm font-medium text-purple-700">
                {wordCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (wordCount / 1000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              onClick={() => onToggleLearning(code, isLearning)}
              variant={isLearning ? "outline" : "default"}
              className={cn(
                "flex-1",
                isLearning
                  ? "border-red-300 text-red-600 hover:bg-red-50"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              )}
            >
              {isLearning ? (
                <>Remove</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Learning
                </>
              )}
            </Button>

            {isLearning && (
              <Link
                href={`/practice/${code}`}
                className="flex-1"
              >
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Practice
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;
