import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface PracticeStatsProps {
  stats: {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
  };
}

const PracticeStats = ({ stats }: PracticeStatsProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-sm font-medium">{stats.correct}</span>
      </div>
      <div className="flex items-center gap-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm font-medium">{stats.incorrect}</span>
      </div>
      <div className="flex items-center gap-1">
        <HelpCircle className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium">{stats.skipped}</span>
      </div>
    </div>
  );
};

export default PracticeStats;
