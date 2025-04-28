"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { userWordsTables } from "@/constants/tables";
import { LanguageCodeType } from "@/types";

export const addWordToVocabulary = async ({
  wordId,
  language,
  userId,
}: {
  wordId: string;
  userId: string;
  language: LanguageCodeType;
}) => {
  const userWordsTable = userWordsTables[language];
  try {
    const existingWord = await db
      .select()
      .from(userWordsTable)
      .where(
        and(
          eq(userWordsTable.wordId, wordId),
          eq(userWordsTable.userId, userId)
        )
      )
      .limit(1)
      .then((res) => res[0]);

    if (existingWord) {
      return { success: true, data: existingWord };
    }

    const addedWord = await db
      .insert(userWordsTable)
      .values({ wordId, userId })
      .returning();

    return { success: true, data: addedWord };
  } catch (error) {
    return { success: false, error };
  }
};
