import { SUPPORTED_LANGUAGES } from "@/constants";
import { db } from "@/db";
import { getUserWordsTable } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import LanguageCards from "../practice/LanguageCards";

const LanguageCardsList = async () => {
  const user = await getUserFromSession();

  if (!user.learningLanguages || !user.learningLanguages?.length) {
    redirect("/user/dashboard");
  }

  const userLanguages = await Promise.all(
    user.learningLanguages.map(async (languageCode) => {
      const userWordsTable = getUserWordsTable(languageCode);

      const words = await db
        .select()
        .from(userWordsTable)
        .where(eq(userWordsTable.userId, user.id));

      return {
        code: languageCode,
        name: SUPPORTED_LANGUAGES[languageCode],
        wordsMastered: words.filter((word) => word.status === "mastered")
          .length,
        wordsReviewing: words.filter((word) => word.status === "reviewing")
          .length,
        wordsLearning: words.filter((word) => word.status === "learning")
          .length,
      };
    })
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userLanguages.map((language) => (
        <LanguageCards
          key={language.code}
          language={language}
        />
      ))}
    </div>
  );
};

export default LanguageCardsList;
