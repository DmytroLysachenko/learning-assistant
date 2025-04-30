"use server";

import { db } from "@/db";
import {
  generateTranslationWords,
  generateTranslationConnections,
} from "@/lib/ai/generators";
import { TranslateWordsOptions } from "@/types";
import { and, eq, notExists } from "drizzle-orm";
import { WORD_TYPES } from "@/constants";
import { chunk } from "lodash";
import { getTranslationTable, getVocabTable, sleep } from "@/lib/utils";

export const translateWordsToLanguage = async ({
  batchSize = 10,
  delayMs = 5000,
  wordType,
  sourceLanguage = "pl",
  targetLanguage = "ru",
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
          eq(mainTable.type, WORD_TYPES[sourceLanguage][wordType]),
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
          `✅ There is no words ramaining to translate from "${sourceLanguage}" to "${targetLanguage}"`
        );
      }

      return { success: true };
    }

    const wordBatches = chunk(allWords, batchSize);

    for (const batch of wordBatches) {
      try {
        const mappedWords = batch.map(({ id, word }) => ({
          id,
          word,
        }));

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
          ({ id, word }) => ({
            id,
            word,
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
