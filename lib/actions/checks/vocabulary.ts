"use server";

import { SUPPORTED_LANGUAGES, vocabTablesNames, WORD_TYPES } from "@/constants";
import { db } from "@/db";
import { GetWordType } from "@/db/types";
import {
  validateVocabularyTranslationWords,
  validateVocabularyWords,
} from "@/lib/ai/validators/wordsValidator";
import {
  getRelevantTranslationTables,
  getTranslationTable,
  getVocabTable,
  sleep,
} from "@/lib/utils";
import { LanguageCodeType, WordType } from "@/types";
import { and, eq, gte, inArray } from "drizzle-orm";
import { chunk, shuffle } from "lodash";

export const removeDuplicatesFromTable = async (table: LanguageCodeType) => {
  const tableName = vocabTablesNames[table];
  try {
    await db.execute(`
      DELETE FROM ${tableName}
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
                 ROW_NUMBER() OVER (PARTITION BY LOWER(word) ORDER BY created_at ASC) AS rn
          FROM ${tableName}
        ) duplicates
        WHERE duplicates.rn > 1
      );
    `);

    console.log(`✅ Duplicates removed from ${tableName}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to remove duplicates from ${tableName}`, error);
    return { success: false, error };
  }
};

export const removeUntranslatedWordsFromTable = async (
  language: LanguageCodeType
) => {
  try {
    const vocabTable = getVocabTable(language);

    const relevantTranslationTables = getRelevantTranslationTables(language);

    const allWordIds = await db
      .select({ id: vocabTable.id })
      .from(vocabTable)
      .then((rows) => rows.map((row) => row.id));

    const linkedWordIds = new Set<string>();

    for (const [key, table] of relevantTranslationTables) {
      const [lang1] = key.split("_");
      const isLangFirst = language === lang1;
      const wordIdColumn = isLangFirst ? table.wordId1 : table.wordId2;

      const links = await db.select({ id: wordIdColumn }).from(table);
      links.forEach(({ id }) => linkedWordIds.add(id));
    }

    const untranslatedWordIds = allWordIds.filter(
      (id) => !linkedWordIds.has(id)
    );

    if (untranslatedWordIds.length > 0) {
      await db
        .delete(vocabTable)
        .where(inArray(vocabTable.id, untranslatedWordIds));

      console.log(
        `🧹 Removed ${untranslatedWordIds.length} untranslated words from "${language}" vocabulary.`
      );
    } else {
      console.log(
        `✅ No untranslated words to remove in "${language}" vocabulary.`
      );
    }
  } catch (error) {
    console.error(
      `❌ Error removing untranslated words for "${language}":`,
      error
    );
    throw error;
  }
};

export const validateVocabulary = async ({
  language,
  wordType,
  batchSize = 10,
  oldDays,
}: {
  language: LanguageCodeType;
  wordType: WordType;
  batchSize: number;
  oldDays?: number;
}) => {
  try {
    console.log(
      `🔍 Starting validation for "${wordType}" words in ${
        SUPPORTED_LANGUAGES[language]
      } (${language.toUpperCase()}) with batch size ${batchSize}`
    );

    const table = getVocabTable(language);

    const allWords = await db
      .select()
      .from(table)
      .where(
        and(
          eq(table.type, WORD_TYPES[language][wordType]),
          gte(
            table.createdAt,
            oldDays
              ? new Date(Date.now() - 1000 * 60 * 60 * 24 * oldDays)
              : new Date(0)
          )
        )
      );

    if (allWords.length === 0) {
      console.log(`⚠️ No words found for type "${wordType}" in "${language}".`);
      return { success: true };
    }

    const wordBatches = chunk(shuffle(allWords), batchSize);

    for (const batch of wordBatches) {
      try {
        const {
          success,
          data: validatedWords,
          error,
        } = await validateVocabularyWords({
          language,
          words: batch,
          wordType,
        });

        if (!validatedWords || !success) {
          throw new Error(String(error) ?? "Validation returned no results.");
        }
        const promises: Promise<unknown>[] = [];

        for (const validated of validatedWords) {
          const original = batch.find((w) => w.id === validated.id);
          if (!original) continue;

          const hasChanges =
            original.word !== validated.word ||
            original.example !== validated.example ||
            original.type !== validated.type ||
            original.difficulty !== validated.difficulty ||
            (original.comment || "") !== (validated.comment || "");

          if (hasChanges) {
            console.log(`🔧 Updating "${original.word}" (ID: ${original.id})`);
            promises.push(
              db
                .update(table)
                .set({
                  ...validated,
                  updatedAt: new Date(),
                  comment: validated.comment || null,
                })
                .where(eq(table.id, validated.id))
            );
          }
        }

        await Promise.all(promises);

        await sleep(5000);
      } catch (error) {
        console.error("❌ Error validating a batch:", error);
        continue;
      }
    }

    console.log("✅ Vocabulary validation complete.");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Validation error:", error.message);
    } else {
      console.error("❌ Unknown error:", error);
    }
  }
};

export const validateVocabularyTranslations = async ({
  fromLanguage,
  toLanguage,
  wordType,
  batchSize = 10,
}: {
  fromLanguage: LanguageCodeType;
  toLanguage: LanguageCodeType;
  wordType: WordType;
  batchSize?: number;
}) => {
  const VALIDATION_BATCH_DELAY_MS = 5000;
  try {
    console.log(
      `🔍 Starting validation for "${wordType}" words in ${
        SUPPORTED_LANGUAGES[fromLanguage]
      } (${fromLanguage.toUpperCase()}) to ${
        SUPPORTED_LANGUAGES[toLanguage]
      } (${toLanguage.toUpperCase()}) with batch size ${batchSize}`
    );

    const [primaryLanguage, secondaryLanguage] = [
      fromLanguage,
      toLanguage,
    ].sort();

    const isPrimaryFirstLanguage = primaryLanguage === fromLanguage;

    const primaryLanguageVocabTable = getVocabTable(primaryLanguage);
    const secondaryLanguageVocabTable = getVocabTable(secondaryLanguage);

    const translationsTable = getTranslationTable(
      primaryLanguage,
      secondaryLanguage
    );

    const results = (await db
      .select({
        fromLanguageWord: isPrimaryFirstLanguage
          ? primaryLanguageVocabTable
          : secondaryLanguageVocabTable,
        toLanguageWord: !isPrimaryFirstLanguage
          ? primaryLanguageVocabTable
          : secondaryLanguageVocabTable,
      })
      .from(translationsTable)
      .leftJoin(
        primaryLanguageVocabTable,
        eq(translationsTable.wordId1, primaryLanguageVocabTable.id)
      )
      .leftJoin(
        secondaryLanguageVocabTable,
        eq(translationsTable.wordId2, secondaryLanguageVocabTable.id)
      )
      .where(
        eq(
          isPrimaryFirstLanguage
            ? primaryLanguageVocabTable.type
            : secondaryLanguageVocabTable.type,
          WORD_TYPES[
            isPrimaryFirstLanguage ? primaryLanguage : secondaryLanguage
          ][wordType]
        )
      )) as {
      fromLanguageWord: GetWordType[typeof fromLanguage];
      toLanguageWord: GetWordType[typeof toLanguage];
    }[];

    const filteredResults = results.filter(
      (entry) => entry.fromLanguageWord && entry.toLanguageWord
    );
    console.log("IMPORTANT: ", filteredResults.length);

    if (filteredResults.length === 0) {
      console.log(
        `⚠️ No valid word pairs found for type "${wordType}" in "${fromLanguage}".`
      );
      return { success: true };
    }

    const wordBatches = chunk(shuffle(filteredResults), batchSize);

    let totalUpdated = 0;

    for (const batch of wordBatches) {
      try {
        const {
          success,
          data: validatedWords,
          error,
        } = await validateVocabularyTranslationWords({
          fromLanguage,
          toLanguage,
          entries: batch,
          wordType,
        });

        if (!validatedWords || !success) {
          throw new Error(String(error) ?? "Validation returned no results.");
        }
        const promises: Promise<unknown>[] = [];

        for (const validated of validatedWords) {
          const matchedEntry = batch.find(
            (entry) => entry.toLanguageWord.id === validated.id
          );

          if (!matchedEntry) {
            console.warn(
              `⚠️ Could not find original entry for ID: ${validated.id}`
            );
            continue;
          }

          const original = matchedEntry.toLanguageWord;
          const hasChanges =
            original.word !== validated.word ||
            original.example !== validated.example ||
            original.type !== validated.type ||
            original.difficulty !== validated.difficulty ||
            (original.comment || "") !== (validated.comment || "");

          if (hasChanges) {
            totalUpdated++;
            console.log(`🔧 Updating "${original.word}" (ID: ${original.id})`);
            promises.push(
              db
                .update(
                  isPrimaryFirstLanguage
                    ? secondaryLanguageVocabTable
                    : primaryLanguageVocabTable
                )
                .set({
                  ...validated,
                  updatedAt: new Date(),
                  comment: validated.comment || null,
                })
                .where(
                  eq(
                    (isPrimaryFirstLanguage
                      ? secondaryLanguageVocabTable
                      : primaryLanguageVocabTable
                    ).id,
                    validated.id
                  )
                )
            );
          }
        }

        await Promise.all(promises);

        await sleep(VALIDATION_BATCH_DELAY_MS);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("❌ Validation error:", error.message);
        } else {
          console.error("❌ Unknown error:", error);
        }
      }
    }
    console.log(
      `✅ Vocabulary validation complete. ${totalUpdated} entries updated.`
    );
    return { success: true };
  } catch (error) {
    console.error(
      `❌ Failed to validate vocabulary for "${toLanguage}":`,
      error
    );
    return { success: false, error };
  }
};
