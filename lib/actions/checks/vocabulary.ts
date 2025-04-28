"use server";

import { vocabTablesNames, WORD_TYPES } from "@/constants";
import { translationTables, vocabTables } from "@/constants/tables";
import { db } from "@/db";
import { validateVocabularyWords } from "@/lib/ai/validators/wordsValidator";
import { sleep } from "@/lib/utils";
import { LanguageCodeType, WordType } from "@/types";
import { eq, inArray } from "drizzle-orm";
import { chunk } from "lodash";

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
  } catch (err) {
    console.error(`❌ Failed to remove duplicates from ${tableName}`, err);
    throw err;
  }
};

export const removeUntranslatedWordsFromTable = async (
  language: LanguageCodeType
) => {
  const vocabTable = vocabTables[language];

  if (!vocabTable) {
    throw new Error(`Vocab table for language "${language}" not found.`);
  }

  // Filter all translation tables that include this language
  const relevantTranslationTables = Object.entries(translationTables).filter(
    ([key]) => key.includes(language)
  );

  if (relevantTranslationTables.length === 0) {
    console.warn(`⚠️ No translation tables found for language "${language}".`);
    return;
  }

  try {
    // Get all word IDs from this vocab table
    const allWordIds = await db
      .select()
      .from(vocabTable)
      .then((rows) => rows.map((row) => row.id));

    const linkedWordIdsSet = new Set<string>();

    for (const [key, translationTable] of relevantTranslationTables) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [lang1, lang2] = key.split("_");

      const isLangFirst = language === lang1;

      const wordIdColumn = isLangFirst
        ? translationTable.wordId1
        : translationTable.wordId2;

      // Collect all word IDs from the relevant column
      const wordLinks = await db
        .select({ id: wordIdColumn })
        .from(translationTable);

      wordLinks.forEach(({ id }) => linkedWordIdsSet.add(id));
    }

    // Figure out which words are unlinked in all translation tables
    const untranslatedWordIds = allWordIds.filter(
      (id) => !linkedWordIdsSet.has(id)
    );

    if (untranslatedWordIds.length > 0) {
      await db
        .delete(vocabTable)
        .where(inArray(vocabTable.id, untranslatedWordIds));

      console.log(
        `🧹 Removed ${untranslatedWordIds.length} untranslated words from ${language} vocabulary`
      );
    } else {
      console.log(`✅ No untranslated words found for ${language}`);
    }
  } catch (error) {
    console.error(
      `❌ Error cleaning untranslated words for "${language}":`,
      error
    );
    throw error;
  }
};

export const validateVocabulary = async ({
  language,
  wordType,
  batchSize = 10,
  dryRun = false,
}: {
  language: LanguageCodeType;
  wordType: WordType;
  batchSize: number;
  dryRun?: boolean;
}) => {
  console.log(
    `Validating words ${wordType} in ${language} with batch size ${batchSize}`
  );
  const table = vocabTables[language];

  const allWords = await db
    .select()
    .from(table)
    .where(eq(table.type, WORD_TYPES[language][wordType]));

  console.log(
    `🔍 Validating ${
      allWords.length
    } "${wordType}" words in ${language.toUpperCase()}`
  );

  const wordBatches = chunk(allWords, batchSize);

  for (const batch of wordBatches) {
    const { data: validatedWords } = await validateVocabularyWords({
      language,
      words: batch,
      wordType,
    });

    if (!validatedWords) {
      console.warn("⚠️ Validation failed or returned no results for batch.");
      continue;
    }

    for (const validated of validatedWords) {
      const original = batch.find((w) => w.id === validated.id);

      if (!original) continue;

      const normalizedOriginal = {
        ...original,
        comment: original.comment || "", // normalize null to empty string
      };
      const normalizedValidated = {
        ...validated,
        comment: validated.comment || "",
      };

      // Compare only mutable fields
      const hasChanges =
        normalizedOriginal.word !== normalizedValidated.word ||
        normalizedOriginal.example !== normalizedValidated.example ||
        normalizedOriginal.type !== normalizedValidated.type ||
        normalizedOriginal.difficulty !== normalizedValidated.difficulty ||
        normalizedOriginal.comment !== normalizedValidated.comment;

      if (hasChanges) {
        console.log(
          `🔧 Word "${original.word}" (id: ${original.id}) will be updated.`
        );

        if (!dryRun) {
          await db
            .update(table)
            .set({
              ...validated,
              updatedAt: new Date(),
              comment: validated.comment || null, // restore null if needed
            })
            .where(eq(table.id, validated.id));
        }
      }
    }

    await sleep(5000);
  }

  console.log(dryRun ? "🔎 Dry run complete." : "✅ Validation complete.");
};
