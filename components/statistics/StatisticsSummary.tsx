import { Award, Clock, Calendar, Target } from "lucide-react";

interface StatsSummaryProps {
  stats: {
    totalWordsLearned: number;
    totalLanguages: number;
    daysActive: number;
    currentStreak: number;
    longestStreak: number;
    averageAccuracy: number;
    timeSpent: number;
  };
}

const StatsSummary = ({ stats }: StatsSummaryProps) => {
  const {
    totalWordsLearned,
    totalLanguages,
    daysActive,
    currentStreak,
    longestStreak,
    averageAccuracy,
    timeSpent,
  } = stats;

  const hours = Math.floor(timeSpent / 60);
  const minutes = timeSpent % 60;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium text-gray-900">Words Learned</h3>
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {totalWordsLearned}
        </div>
        <div className="text-xs text-gray-500">
          Across {totalLanguages} languages
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium text-gray-900">Current Streak</h3>
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {currentStreak} days
        </div>
        <div className="text-xs text-gray-500">
          Longest: {longestStreak} days
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium text-gray-900">Accuracy</h3>
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {averageAccuracy}%
        </div>
        <div className="text-xs text-gray-500">Average correct answers</div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium text-gray-900">Time Spent</h3>
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {hours}h {minutes}m
        </div>
        <div className="text-xs text-gray-500">
          Over {daysActive} active days
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
