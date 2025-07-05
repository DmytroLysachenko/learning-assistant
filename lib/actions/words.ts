"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { LanguageCodeType } from "@/types";
import { getUserWordsTable } from "../utils";
import { UpdateUserWordType } from "@/db/types";

export const addWordToUserVocabulary = async ({
  wordId,
  language,
  userId,
}: {
  wordId: string;
  userId: string;
  language: LanguageCodeType;
}) => {
  try {
    const userWordsTable = getUserWordsTable(language);
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

export const removeWordFromUserVocabulary = async ({
  wordId,
  language,
  userId,
}: {
  wordId: string;
  userId: string;
  language: LanguageCodeType;
}) => {
  try {
    const userWordsTable = getUserWordsTable(language);

    await db
      .delete(userWordsTable)
      .where(
        and(
          eq(userWordsTable.wordId, wordId),
          eq(userWordsTable.userId, userId)
        )
      );

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateWordInUserVocabulary = async ({
  userId,
  wordId,
  language,
  status,
  correctAnswersCount,
  lastReviewedAt,
}: UpdateUserWordType & { language: LanguageCodeType }) => {
  try {
    const userWordsTable = getUserWordsTable(language);

    const updatedWordRecord = await db
      .update(userWordsTable)
      .set({ status, correctAnswersCount, lastReviewedAt })
      .where(
        and(
          eq(userWordsTable.wordId, wordId),
          eq(userWordsTable.userId, userId)
        )
      )
      .returning({
        status: userWordsTable.status,
        correctAnswersCount: userWordsTable.correctAnswersCount,
        lastReviewedAt: userWordsTable.lastReviewedAt,
      })
      .then((res) => res[0]);
    return { success: true, data: updatedWordRecord };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const incrementCorrectAnswersCount = async ({
  recordId,
  language,
}: {
  recordId: string;
  language: LanguageCodeType;
}) => {
  try {
    const userWordsTable = getUserWordsTable(language);

    const currentRecord = await db
      .select({
        correctAnswersCount: userWordsTable.correctAnswersCount,
      })
      .from(userWordsTable)
      .where(eq(userWordsTable.id, recordId))
      .then((res) => res[0]);

    if (!currentRecord) {
      throw new Error("Word not found for user");
    }

    const newCount = currentRecord.correctAnswersCount + 1;

    const newStatus =
      newCount >= 10 ? "mastered" : newCount >= 4 ? "reviewing" : undefined;

    const updatedWordRecord = await db
      .update(userWordsTable)
      .set({
        correctAnswersCount: newCount,
        lastReviewedAt: new Date(),
        ...(newStatus && { status: newStatus }),
      })
      .where(eq(userWordsTable.id, recordId))
      .returning({
        status: userWordsTable.status,
        correctAnswersCount: userWordsTable.correctAnswersCount,
        lastReviewedAt: userWordsTable.lastReviewedAt,
      })
      .then((res) => res[0]);

    return { success: true, data: updatedWordRecord };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const incrementWrongAnswersCount = async ({
  recordId,
  language,
}: {
  recordId: string;
  language: LanguageCodeType;
}) => {
  try {
    const userWordsTable = getUserWordsTable(language);

    const currentRecord = await db
      .select({
        value: userWordsTable.wrongAnswersCount,
      })
      .from(userWordsTable)
      .where(eq(userWordsTable.id, recordId))
      .then((res) => res[0].value ?? 0);

    if (!currentRecord) {
      throw new Error("Word not found for user");
    }

    const newCount = currentRecord + 1;

    const updatedWordRecord = await db
      .update(userWordsTable)
      .set({
        wrongAnswersCount: newCount,
        lastReviewedAt: new Date(),
      })
      .where(eq(userWordsTable.id, recordId))
      .returning({
        status: userWordsTable.status,
        wrongAnswersCount: userWordsTable.wrongAnswersCount,
        lastReviewedAt: userWordsTable.lastReviewedAt,
      })
      .then((res) => res[0]);

    return { success: true, data: updatedWordRecord };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
