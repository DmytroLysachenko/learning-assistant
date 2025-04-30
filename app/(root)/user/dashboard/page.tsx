import UserDashboard from "@/components/dashboard/UserDashboard";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";

const DashboardPage = async () => {
  const user = await getUserFromSession();

  const learningLanguages = [
    {
      code: "pl",
      name: "Polish",
      flag: "🇵🇱",
      progress: 68,
      level: "B1",
      wordsLearned: 487,
      lastPracticed: "Today",
    },
    {
      code: "ru",
      name: "Russian",
      flag: "🇷🇺",
      progress: 34,
      level: "A2",
      wordsLearned: 215,
      lastPracticed: "Yesterday",
    },
  ];

  const achievements = [
    {
      id: 1,
      name: "Word Master",
      description: "Learn 500 words in any language",
      icon: "📚",
      progress: 487,
      target: 500,
      level: 3,
    },
    {
      id: 2,
      name: "Streak Champion",
      description: "Maintain a 14-day learning streak",
      icon: "🔥",
      progress: 7,
      target: 14,
      level: 2,
    },
    {
      id: 3,
      name: "Grammar Guru",
      description: "Complete 50 grammar exercises",
      icon: "🏆",
      progress: 32,
      target: 50,
      level: 4,
    },
    {
      id: 4,
      name: "Vocabulary Virtuoso",
      description: "Score 90% or higher on 20 vocabulary quizzes",
      icon: "🎯",
      progress: 12,
      target: 20,
      level: 2,
    },
  ];

  const statistics = {
    dailyAverage: 24,
    totalSessions: 87,
    accuracyRate: 84,
    wordsLearned: 780,
    exercisesCompleted: 156,
    perfectScores: 23,
  };

  return (
    <UserDashboard
      user={user}
      languages={learningLanguages}
      achievements={achievements}
      statistics={statistics}
    />
  );
};

export default DashboardPage;
