import { Trophy, Award, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AchievementStatsProps {
  stats: {
    totalAchievements: number;
    completedAchievements: number;
    totalXpEarned: number;
    nextAchievement: {
      title: string;
      progress: number;
    };
    level: number;
    xpToNextLevel: number;
  };
}

const AchievementStats = ({ stats }: AchievementStatsProps) => {
  const {
    totalAchievements,
    completedAchievements,
    totalXpEarned,
    nextAchievement,
    level,
    xpToNextLevel,
  } = stats;

  const completionPercentage = Math.round(
    (completedAchievements / totalAchievements) * 100
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-purple-50 p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Achievements</h3>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div className="text-3xl font-bold text-purple-700">
            {completedAchievements}
          </div>
          <div className="text-sm text-gray-500">
            of {totalAchievements} total
          </div>
        </div>
        <Progress
          value={completionPercentage}
          className="h-2 mb-2"
        />
        <div className="text-xs text-gray-500 text-right">
          {completionPercentage}% complete
        </div>
      </div>

      <div className="bg-purple-50 p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Award className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Level {level}</h3>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div className="text-3xl font-bold text-purple-700">
            {totalXpEarned} XP
          </div>
          <div className="text-sm text-gray-500">
            {xpToNextLevel} XP to next level
          </div>
        </div>
        <Progress
          value={70}
          className="h-2 mb-2"
        />
        <div className="text-xs text-gray-500 text-right">
          70% to Level {level + 1}
        </div>
      </div>

      <div className="bg-purple-50 p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Next Achievement</h3>
        </div>
        <div className="mb-2">
          <div className="text-lg font-semibold text-purple-700 mb-1">
            {nextAchievement.title}
          </div>
          <div className="text-sm text-gray-500 mb-2">Almost there!</div>
        </div>
        <Progress
          value={nextAchievement.progress}
          className="h-2 mb-2"
        />
        <div className="text-xs text-gray-500 text-right">
          {nextAchievement.progress}% complete
        </div>
      </div>
    </div>
  );
};

export default AchievementStats;
