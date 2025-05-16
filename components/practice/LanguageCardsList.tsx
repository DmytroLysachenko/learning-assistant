import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React, { Fragment } from "react";

import { SUPPORTED_LANGUAGES } from "@/constants";
import { db } from "@/db";
import { getUserWordsTable } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import LanguageCard from "./LanguageCard";

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
      {userLanguages.map(
        ({ code, name, wordsMastered, wordsReviewing, wordsLearning }) => (
          <Fragment key={code}>
            {wordsLearning > 0 && (
              <LanguageCard
                type="learning"
                languageName={name}
                languageCode={code}
                wordCount={wordsLearning}
                description={`Practice your own vocabulary words in ${name}`}
              />
            )}

            {wordsReviewing > 0 && (
              <LanguageCard
                type="reviewing"
                languageName={name}
                languageCode={code}
                wordCount={wordsReviewing}
                description={`Practice words you are familiar with in ${name}, to master them completely.`}
              />
            )}

            {wordsMastered > 0 && (
              <LanguageCard
                type="mastered"
                languageName={name}
                languageCode={code}
                wordCount={wordsMastered}
                description={`Practice your already mastered words in ${name}, not to forget them.`}
              />
            )}
          </Fragment>
        )
      )}
    </div>
  );
};

export default LanguageCardsList;
