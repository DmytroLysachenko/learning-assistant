"use server";

import { userWordsTables } from "@/constants/tables";
import { db } from "@/db";

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
    const addedWord = await db
      .insert(userWordsTable)
      .values({ wordId, userId });
    console.log(addedWord);
    return { success: true, data: addedWord };
  } catch (error) {
    return { success: false, error };
  }
};
