import React from "react";
import LanguageCard from "./LanguageCard";
import { getVocabTable } from "@/lib/utils";
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_CODES } from "@/constants";
import { db } from "@/db";
import { count } from "drizzle-orm";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { LanguageCodeType } from "@/types";

const LanguagesList = async () => {
  const userLanguages: LanguageCodeType[] = [];

  const user = await getUserFromSession();

  if (user.learningLanguages) {
    userLanguages.push(...user.learningLanguages);
  }

  const languages = await Promise.all(
    Object.values(SUPPORTED_LANGUAGES_CODES).map(async (language) => {
      const languageVocabTable = getVocabTable(language);
      const wordCount = await db
        .select({ count: count() })
        .from(languageVocabTable)
        .then((res) => res[0]?.count || 0);

      return {
        code: language,
        name: SUPPORTED_LANGUAGES[language],
        wordCount,
      };
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {languages.map((language) => (
        <LanguageCard
          userLanguages={userLanguages}
          key={language.code}
          language={language}
          userId={user.id}
        />
      ))}
    </div>
  );
};

export default LanguagesList;
