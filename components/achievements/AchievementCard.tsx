"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    progress: number;
    completed: boolean;
    completedDate: string | null;
    reward: string;
  };
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const {
    title,
    description,
    icon,
    progress,
    completed,
    completedDate,
    reward,
  } = achievement;

  // Format date if available
  const formattedDate = completedDate
    ? new Date(completedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card
      className={`border-2 ${
        completed ? "border-purple-200" : "border-gray-200"
      } hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-full ${
              completed
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {icon}
          </div>
          {completed && (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              Completed
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium text-purple-600">
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-purple-600">
            <Gift className="h-4 w-4 mr-1" />
            <span>{reward}</span>
          </div>
          {formattedDate && (
            <span className="text-gray-500">Earned on {formattedDate}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default AchievementCard;
