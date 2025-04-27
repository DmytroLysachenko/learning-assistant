"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { LanguageCodeType, WordTypeCount } from "@/types";

interface WordTypeStatsProps {
  typeCounts: WordTypeCount[];
  language: LanguageCodeType;
}

const WordTypeStats = ({ typeCounts, language }: WordTypeStatsProps) => {
  const sortedData = [...typeCounts].sort((a, b) => b.count - a.count);

  const totalCount = sortedData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="w-full p-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Word Types Distribution</CardTitle>
        <CardDescription>
          Number of words by type for {SUPPORTED_LANGUAGES[language]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Visual representation using CSS-based bars */}
        <div className="space-y-3 mb-6">
          {sortedData.map((item) => {
            const percentage = ((item.count / totalCount) * 100).toFixed(1);
            return (
              <div
                key={item.type}
                className="space-y-1"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium capitalize">
                    {item.type.toLowerCase()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-gray-500">
                      {item.count.toLocaleString()} words
                    </span>
                    <span className="text-end">{percentage}%</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="font-medium flex justify-between">
          <div className="py-2">Total:</div>
          <div className="text-right py-2">{totalCount.toLocaleString()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordTypeStats;
