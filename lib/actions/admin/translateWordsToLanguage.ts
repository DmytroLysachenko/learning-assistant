"use server";

import { db } from "@/db";
import { vocabTables, translationTables } from "@/constants/tables";
import {
  generateTranslationWords,
  generateTranslationConnections,
} from "@/lib/ai/generators";
import { TranslateWordsOptions } from "@/types";
import { and, eq, notExists } from "drizzle-orm";
import { WORD_TYPES } from "@/constants";
import { chunk } from "lodash";
import { sleep } from "@/lib/utils";

export const translateWordsToLanguage = async ({
  batchSize = 10,
  delayMs = 5000,
  wordType,
  sourceLanguage = "pl",
  targetLanguage = "ru",
  log = true,
}: TranslateWordsOptions) => {
  const mainTable = vocabTables[sourceLanguage];
  const translationTable = vocabTables[targetLanguage];

  const [firstLang, secondLang] = [sourceLanguage, targetLanguage].sort();

  const key = `${firstLang}_${secondLang}` as keyof typeof translationTables;

  const translationsTable = translationTables[key];

  if (!translationsTable) {
    return {
      success: false,
      error: `Translation table for ${firstLang} and ${secondLang} not found.`,
    };
  }

  try {
    const allWords = await db
      .select()
      .from(mainTable)
      .where(
        and(
          eq(mainTable.type, WORD_TYPES[sourceLanguage][wordType]),
          notExists(
            db
              .select()
              .from(translationsTable)
              .where(
                eq(
                  translationsTable[
                    firstLang === sourceLanguage ? "wordId1" : "wordId2"
                  ],
                  mainTable.id
                )
              )
          )
        )
      );

    if (!allWords.length) {
      if (log) {
        console.log(
          `✅ There is no words ramaining to translate from "${sourceLanguage}" to "${targetLanguage}"`
        );
      }

      return { success: true };
    }

    const wordBatches = chunk(allWords, batchSize);

    for (const batch of wordBatches) {
      const mappedWords = batch.map((w) => ({
        id: w.id,
        word: w.word,
      }));

      const { success: translatedWordsSuccess, data: translatedWords } =
        await generateTranslationWords(
          sourceLanguage,
          targetLanguage,
          mappedWords
        );

      if (!translatedWordsSuccess || !translatedWords?.length) {
        if (log) console.warn("⚠️ Translation failed.");
        return { success: false };
      }

      const insertedTranslatedWords = await db
        .insert(translationTable)
        .values(translatedWords)
        .returning();

      const mappedTranslatedWords = insertedTranslatedWords.map((w) => ({
        id: w.id,
        word: w.word,
      }));

      const { success: connectionsSuccess, data: translationConnections } =
        await generateTranslationConnections(
          mappedWords,
          mappedTranslatedWords
        );

      if (!connectionsSuccess || !translationConnections?.length) {
        if (log) console.warn("⚠️ Connection generation failed.");
        return { success: false };
      }

      await db.insert(translationsTable).values(translationConnections);

      await sleep(delayMs);
    }

    if (log) {
      console.log(
        `✅ Translated ${allWords.length} words and saved connections.`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Translation pipeline error:", error);
    return { success: false, error };
  }
};
