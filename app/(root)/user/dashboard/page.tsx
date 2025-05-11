import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { Separator } from "@/components/ui/separator";
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_FLAGS } from "@/constants";
import { db } from "@/db";
import { users } from "@/db/schema";
import { achievements } from "@/db/schema/achievements";
import { getUserWordsTable } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { eq } from "drizzle-orm";

const DashboardPage = async () => {
  const user = await getUserFromSession();
  let totalLearnedWords = 0;
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
      totalLearnedWords += masteredWords.length;
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

  const allAchievements = await db.select().from(achievements);

  const vocabAchievement = allAchievements
    .filter((a) => a.type === "vocabulary")
    .sort((a, b) => a.criteria - b.criteria)
    .find((ach) => ach.criteria > totalLearnedWords);

  const myAchievements = [
    {
      id: vocabAchievement?.id as string,
      name: vocabAchievement?.title as string,
      description: vocabAchievement?.description as string,
      icon: "📚",
      progress: totalLearnedWords,
      target: vocabAchievement?.criteria as number,
      level: vocabAchievement?.level as number,
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
        achievements={myAchievements}
        statistics={statistics}
      />
    </>
  );
};

export default DashboardPage;
