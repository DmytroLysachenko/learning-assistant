"use server";

import { db } from "@/db";
import {
  generateTranslationWords,
  generateTranslationConnections,
} from "@/lib/ai/generators";
import { TranslateWordsOptions } from "@/types";
import { and, eq, notExists } from "drizzle-orm";
import { chunk, shuffle } from "lodash";
import { getTranslationTable, getVocabTable, sleep } from "@/lib/utils";

export const translateWordsToLanguage = async ({
  batchSize = 10,
  delayMs = 5000,
  sourceLanguage,
  targetLanguage,
  log = true,
}: TranslateWordsOptions) => {
  let totalTranslated = 0;

  try {
    const mainTable = getVocabTable(sourceLanguage);
    const translationTable = getVocabTable(targetLanguage);
    const translationsConnectionsTable = getTranslationTable(
      sourceLanguage,
      targetLanguage
    );

    const [firstLang] = [sourceLanguage, targetLanguage].sort();

    if (!translationsConnectionsTable) {
      return {
        success: false,
        error: `Translation table for ${sourceLanguage} and ${targetLanguage} not found.`,
      };
    }

    const allWords = await db
      .select()
      .from(mainTable)
      .where(
        and(
          notExists(
            db
              .select()
              .from(translationsConnectionsTable)
              .where(
                eq(
                  translationsConnectionsTable[
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
          `✅ There is no words remaining to translate from "${sourceLanguage}" to "${targetLanguage}"`
        );
      }

      return { success: true };
    }

    const wordBatches = chunk(shuffle(allWords), batchSize);

    if (log) {
      console.log(
        `Started translation from "${sourceLanguage}" to "${targetLanguage}" of ${allWords.length} words`
      );
    }

    for (const batch of wordBatches) {
      try {
        const mappedWords = batch.map(
          ({ id, word, comment, difficulty, example }) => ({
            id,
            word,
            comment,
            example,
            difficulty,
          })
        );

        const {
          success: translatedWordsSuccess,
          data: translatedWords,
          error: translatedWordsError,
        } = await generateTranslationWords(
          sourceLanguage,
          targetLanguage,
          mappedWords
        );

        if (!translatedWordsSuccess || !translatedWords?.length) {
          throw new Error(String(translatedWordsError) ?? "No words generated");
        }

        const insertedTranslatedWords = await db
          .insert(translationTable)
          .values(translatedWords)
          .returning();

        const mappedTranslatedWords = insertedTranslatedWords.map(
          ({ id, word, comment, difficulty, example }) => ({
            id,
            word,
            comment,
            example,
            difficulty,
          })
        );

        const {
          success: translationConnectionsSuccess,
          data: translationConnections,
          error: translationConnectionsError,
        } = await generateTranslationConnections(
          mappedWords,
          mappedTranslatedWords
        );

        if (!translationConnectionsSuccess || !translationConnections?.length) {
          throw new Error(
            String(translationConnectionsError) ??
              "No translation connections generated"
          );
        }

        await db
          .insert(translationsConnectionsTable)
          .values(translationConnections);

        totalTranslated += mappedWords.length;

        if (log) {
          console.log(`At the moment translated: ${totalTranslated}`);
        }

        await sleep(delayMs);
      } catch (error) {
        console.log(
          `❌ Error translating batch from "${sourceLanguage}" to "${targetLanguage}"`,
          error
        );
        continue;
      }
    }

    if (log) {
      console.log(
        `✅ Translated ${totalTranslated} words from "${sourceLanguage}" to "${targetLanguage}" and saved connections.`
      );
    }

    return { success: true, data: totalTranslated };
  } catch (error) {
    console.error("❌ Translation pipeline error:", error);
    return { success: false, error };
  }
};
