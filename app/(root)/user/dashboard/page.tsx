import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { Separator } from "@/components/ui/separator";
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_FLAGS } from "@/constants";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserWordsTable } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { eq } from "drizzle-orm";

const DashboardPage = async () => {
  const user = await getUserFromSession();

  if (!user.learningLanguages) {
    user.learningLanguages = [];
  }

  const learningLanguages = await Promise.all(
    user.learningLanguages.map(async (languageCode) => {
      const userWordsTable = getUserWordsTable(languageCode);

      const words = await db
        .select({
          id: userWordsTable.wordId,
          status: userWordsTable.status,
        })
        .from(userWordsTable)
        .where(eq(userWordsTable.userId, user.id));

      const masteredWords = words.filter((word) => word.status === "mastered");

      return {
        code: languageCode,
        name: SUPPORTED_LANGUAGES[languageCode],
        flag: SUPPORTED_LANGUAGES_FLAGS[languageCode],
        progress: (masteredWords.length / words.length) * 100,
        wordsLearned: masteredWords.length,
        lastPracticed: "Today",
      };
    })
  );

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
  const rank = await db
    .select()
    .from(users)
    .then((users) => {
      return (
        users
          .sort((a, b) => a.experience - b.experience)
          .findIndex((user) => user.id === user.id) + 1
      );
    });
  return (
    <>
      <DashboardHeader user={{ ...user, rank }} />
      <Separator className="my-4 md:my-6" />
      <UserDashboard
        languages={learningLanguages}
        achievements={achievements}
        statistics={statistics}
      />
    </>
  );
};

export default DashboardPage;
