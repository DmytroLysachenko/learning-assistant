"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityData {
  date: string;
  wordsLearned: number;
  timeSpent: number;
  accuracy: number;
}

interface ActivityChartProps {
  activityData: ActivityData[];
}

const ActivityChart = ({ activityData }: ActivityChartProps) => {
  const [metric, setMetric] = useState<
    "wordsLearned" | "timeSpent" | "accuracy"
  >("wordsLearned");

  const maxValue = Math.max(...activityData.map((d) => d[metric]));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getMetricLabel = () => {
    switch (metric) {
      case "wordsLearned":
        return "Words Learned";
      case "timeSpent":
        return "Time Spent (minutes)";
      case "accuracy":
        return "Accuracy (%)";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Learning Activity</CardTitle>
        <Select
          value={metric}
          onValueChange={(value) =>
            setMetric(value as "wordsLearned" | "timeSpent" | "accuracy")
          }
        >
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wordsLearned">Words Learned</SelectItem>
            <SelectItem value="timeSpent">Time Spent</SelectItem>
            <SelectItem value="accuracy">Accuracy</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <div className="flex h-full items-end gap-2">
            {activityData.map((data, index) => {
              const heightPercentage =
                maxValue > 0 ? (data[metric] / maxValue) * 100 : 0;

              if (data[metric] === 0) {
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    <span className="text-xs text-gray-400 mt-2">
                      {formatDate(data.date)}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors relative group"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data[metric]} {metric === "accuracy" ? "%" : ""}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">
                    {formatDate(data.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          {getMetricLabel()} over the last 14 days
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
