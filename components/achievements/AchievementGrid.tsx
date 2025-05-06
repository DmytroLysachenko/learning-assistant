import AchievementCard from "./AchievementCard";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  completed: boolean;
  completedDate: string | null;
  reward: string;
}

interface AchievementGridProps {
  achievements: Achievement[];
}

const AchievementGrid = ({ achievements }: AchievementGridProps) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">No achievements found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
        />
      ))}
    </div>
  );
};

export default AchievementGrid;
