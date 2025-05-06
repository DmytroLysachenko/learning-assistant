"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LanguageProgressProps {
  wordsPerLanguage: Record<string, number>;
}

const LanguageProgress = ({ wordsPerLanguage }: LanguageProgressProps) => {
  // Calculate total words
  const totalWords = Object.values(wordsPerLanguage).reduce(
    (sum, count) => sum + count,
    0
  );

  // Sort languages by word count (descending)
  const sortedLanguages = Object.entries(wordsPerLanguage).sort(
    ([, countA], [, countB]) => countB - countA
  );

  // Generate a color for each language
  const colors = [
    "bg-purple-500",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-green-500",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium">
          Language Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-center justify-center mb-6">
          <div className="relative h-[180px] w-[180px] rounded-full">
            {sortedLanguages.map(([language, count], index) => {
              const percentage = (count / totalWords) * 100;
              const previousPercentages = sortedLanguages
                .slice(0, index)
                .reduce(
                  (sum, [, prevCount]) => sum + (prevCount / totalWords) * 100,
                  0
                );

              return (
                <div
                  key={language}
                  className={`absolute inset-0 rounded-full ${
                    colors[index % colors.length]
                  }`}
                  style={{
                    clipPath: `conic-gradient(from 0deg, transparent ${previousPercentages}%, transparent ${previousPercentages}%, current ${
                      previousPercentages + percentage
                    }%)`,
                  }}
                />
              );
            })}
            <div className="absolute inset-[15%] rounded-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">
                  {totalWords}
                </div>
                <div className="text-xs text-gray-500">Total Words</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedLanguages.map(([language, count], index) => {
            const percentage = Math.round((count / totalWords) * 100);

            return (
              <div key={language}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{language}</span>
                  <span className="text-sm text-gray-500">
                    {count} words ({percentage}%)
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  indicatorClassName={colors[index % colors.length]}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageProgress;
