"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LanguageCardProps {
  language: {
    code: string;
    name: string;
    progress: number;
    wordsLearned: number;
    totalWords: number;
  };
}

const LanguageCard = ({ language }: LanguageCardProps) => {
  const { code, name, progress, wordsLearned, totalWords } = language;

  return (
    <Link
      href={`/practice/${code}`}
      className="block group"
    >
      <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all hover:border-purple-300 h-full">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-gray-900">{name}</h2>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm font-medium text-purple-600">
                  {progress}%
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2"
              />
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-purple-600">
                {wordsLearned}
              </span>{" "}
              of <span className="font-medium">{totalWords}</span> words learned
            </div>

            <div className="mt-auto">
              <button className="w-full py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors text-sm font-medium">
                Practice Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LanguageCard;
