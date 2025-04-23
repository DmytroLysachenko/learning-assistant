"use server";

import { vocabTables, vocabTablesNames, WORD_TYPES } from "@/constants";
import { db } from "@/db";
import { translationTables, vocabTableMap } from "@/db/schema";
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
  lang1: LanguageCodeType,
  lang2: LanguageCodeType
) => {
  // Sort the language pair to ensure we always get the correct order (alphabetically)
  const [firstLang, secondLang] = [lang1, lang2].sort();

  // Generate the key for the translation table in the correct order
  const key = `${firstLang}_${secondLang}`;

  // Find the applicable translation table
  const translationTableMeta = translationTables.find((t) => t.key === key);

  if (!translationTableMeta) {
    throw new Error(
      `Translation table for ${firstLang} and ${secondLang} not found.`
    );
  }

  const vocabTable1 = vocabTables[firstLang];
  const vocabTable2 = vocabTables[secondLang];
  const translationTable = translationTableMeta.table;

  try {
    // Get all word IDs from both vocabulary tables
    const allWordsIdTable1 = await db
      .select()
      .from(vocabTable1)
      .then((w) => w.map((w) => w.id));

    const allWordsIdTable2 = await db
      .select()
      .from(vocabTable2)
      .then((w) => w.map((w) => w.id));

    // Get all the word IDs from the translation table for both wordId1 and wordId2
    const linkedWordIdsTable1 = await db
      .select({ id: translationTable.wordId1 })
      .from(translationTable)
      .then((w) => w.map((w) => w.id));

    const linkedWordIdsTable2 = await db
      .select({ id: translationTable.wordId2 })
      .from(translationTable)
      .then((w) => w.map((w) => w.id));

    // Clean up words in vocabTable1 that aren't linked to any translation in table2
    const untranslatedWordsTable1 = allWordsIdTable1.filter(
      (id) => !linkedWordIdsTable1.includes(id)
    );
    if (untranslatedWordsTable1.length > 0) {
      await db
        .delete(vocabTable1)
        .where(inArray(vocabTable1.id, untranslatedWordsTable1));
      console.log(
        `🧹 Removed ${untranslatedWordsTable1.length} untranslated words from ${firstLang} vocabulary`
      );
    }

    // Clean up words in vocabTable2 that aren't linked to any translation in table1
    const untranslatedWordsTable2 = allWordsIdTable2.filter(
      (id) => !linkedWordIdsTable2.includes(id)
    );
    if (untranslatedWordsTable2.length > 0) {
      await db

        .delete(vocabTable2)
        .where(inArray(vocabTable2.id, untranslatedWordsTable2));

      console.log(
        `🧹 Removed ${untranslatedWordsTable2.length} untranslated words from ${secondLang} vocabulary`
      );
    }
  } catch (error) {
    console.error(`❌ Error cleaning untranslated words:`, error);
    throw error;
  }
};

export const validateVocabulary = async (
  lang: LanguageCodeType,
  wordType: WordType,
  dryRun = false
) => {
  const table = vocabTableMap[lang];
  const BATCH_SIZE = 5;

  const allWords = await db
    .select()
    .from(table)
    .where(eq(table.type, WORD_TYPES[lang][wordType]));

  console.log(
    `🔍 Validating ${
      allWords.length
    } "${wordType}" words in ${lang.toUpperCase()}`
  );

  const wordBatches = chunk(allWords, BATCH_SIZE);

  for (const batch of wordBatches) {
    const { data: validatedWords } = await validateVocabularyWords({
      lang,
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
