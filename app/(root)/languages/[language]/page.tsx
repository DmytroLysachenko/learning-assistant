import WordTypeStats from "@/components/languages/LanguageWordsStats";
import { WORD_TYPES } from "@/constants";
import { db } from "@/db";
import { vocabTables } from "@/db/schema";
import { LanguageCodeType } from "@/types";
import { count, eq } from "drizzle-orm";
import React from "react";

const LanguagePage = async ({
  params,
}: {
  params: Promise<{ language: LanguageCodeType }>;
}) => {
  const { language } = await params;

  const vocabTable = vocabTables[language];

  const typeCounts = await Promise.all(
    Object.values(WORD_TYPES[language]).map(async (type) => {
      const countAmount = await db
        .select({ count: count() })
        .from(vocabTable)
        .where(eq(vocabTable.type, type))
        .limit(1)
        .then((res) => res[0]?.count || 0);

      return { type, count: countAmount };
    })
  );
  return (
    <div>
      <WordTypeStats
        typeCounts={typeCounts}
        language={language}
      />
    </div>
  );
};

export default LanguagePage;
