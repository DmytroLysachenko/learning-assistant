"use server";

import { db } from "@/db";

import {
  ALPHABETS,
  vocabTables,
  vocabTablesNames,
  WORD_TYPES_PL_PROMPTS,
  WORDS_LANGUAGE_LEVELS,
} from "@/constants";
import { sleep } from "../utils";
import { generateVocabularyByLetter } from "../ai/generators/vocabularyByAlphabet";
import { generateTranslationWords } from "../ai/generators/translator";

import { generateTranslationConnections } from "../ai/generators/connectionMapper";
import { LanguageCodeType } from "@/types";
import { generateVocabularyByTopic } from "../ai/generators/vocabularyByTopic";

type WordLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface SeedWordsOptions {
  total: number;
  batchSize?: number;
  delayMs?: number;
  randomizeType?: boolean;
  randomizeCategory?: boolean;
  level?: WordLevel;
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS;
  log?: boolean;
  language?: LanguageCodeType;
  translationLanguage?: LanguageCodeType;
}

export const removeDuplicatesFromTable = async (table: "pl" | "ru") => {
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

export const seedWordsByTopic = async ({
  total,
  batchSize = 10,
  delayMs = 5000,
  randomizeType = false,
  level,
  wordType,
  language = "pl",
  translationLanguage = "ru",
  log = true,
}: SeedWordsOptions) => {
  const batches = Math.ceil(total / batchSize);
  let totalGenerated = 0;

  const mainVocabularyTable = vocabTables[language];
  const translationVocabularyTable = vocabTables[translationLanguage];

  if (log) {
    console.log(`🚀 Starting to seed ${total} words by topic...`);
  }

  for (let i = 0; i < batches; i++) {
    const currentLevel =
      level ||
      WORDS_LANGUAGE_LEVELS[
        Math.floor(Math.random() * WORDS_LANGUAGE_LEVELS.length)
      ];

    const currentType = randomizeType
      ? (Object.keys(WORD_TYPES_PL_PROMPTS)[
          Math.floor(Math.random() * Object.keys(WORD_TYPES_PL_PROMPTS).length)
        ] as keyof typeof WORD_TYPES_PL_PROMPTS)
      : wordType;

    try {
      const {
        success: newWordsSuccess,
        data: newWords,
        error: newWordsError,
      } = await generateVocabularyByTopic({
        lang: language,
        quantity: batchSize,
        level: currentLevel,
        wordType: currentType,
      });

      if (!newWordsSuccess || !newWords || !newWords.length) {
        return { success: false, error: newWordsError };
      }

      const insertedNewWords = await db
        .insert(mainVocabularyTable)
        .values(newWords)
        .returning();

      const mappedNewWords = insertedNewWords.map((w) => ({
        id: w.id,
        word: w.word,
      }));

      const {
        success: translatedWordsSuccess,
        data: translatedWords,
        error: translatedWordsError,
      } = await generateTranslationWords(
        language,
        translationLanguage,
        mappedNewWords
      );

      if (!translatedWordsSuccess || !translatedWords) {
        return { success: false, error: translatedWordsError };
      }

      const insertedTranslatedWords = await db
        .insert(translationVocabularyTable)
        .values(translatedWords)
        .returning();

      const mappedTranslatedWords = insertedTranslatedWords.map((w) => ({
        id: w.id,
        word: w.word,
      }));

      const {
        success: translationsSuccess,
        data: translationLinks,
        error: translationsError,
      } = await generateTranslationConnections(
        mappedNewWords,
        mappedTranslatedWords
      );

      if (!translationsSuccess || !translationLinks) {
        return { success: false, error: translationsError };
      }

      totalGenerated += batchSize;

      if (log) {
        console.log(
          `✅ Batch ${i + 1} complete | Total so far: ${totalGenerated} words`
        );
      }
    } catch (error) {
      console.error(`❌ Error in batch ${i + 1}:`, error);
    }

    if (i < batches - 1 && delayMs > 0) {
      if (log) console.log(`⏱ Waiting ${delayMs / 1000}s before next batch...`);
      await sleep(delayMs);
    }
  }

  if (log) {
    console.log("🧹 Running post-generation cleanups...");
  }

  await removeDuplicatesFromTable("pl");
  await removeDuplicatesFromTable("ru");

  if (log) {
    console.log("🔍 Running quality check...");
  }

  // const issues = await checkGeneratedDataQuality();

  // if (!issues.length) {
  //   console.log("🎉 All looks clean!");
  // } else {
  //   console.warn(`⚠️ Found ${issues.length} potential issue(s).`);
  // }
};

export const seedWordsByAlphabet = async ({
  batchSize = 10,
  delayMs = 5000,
  level,
  wordType,
  language = "pl",
  translationLanguage = "ru",
  log = true,
}: Omit<SeedWordsOptions, "total">) => {
  let totalGenerated = 0;
  const mainVocabularyTable = vocabTables[language];
  const translationVocabularyTable = vocabTables[translationLanguage];

  for (const letter of ALPHABETS[language]) {
    const existing = await db
      .select({ word: mainVocabularyTable.word })
      .from(mainVocabularyTable);

    const existingWords = existing
      .map((e) => e.word)
      .filter((w) => w.toLowerCase().startsWith(letter.toLowerCase()));

    const currentLevel =
      level ||
      WORDS_LANGUAGE_LEVELS[
        Math.floor(Math.random() * WORDS_LANGUAGE_LEVELS.length)
      ];

    if (log) {
      console.log(
        `🔤 Generating for letter "${letter}" | Existing: ${existingWords.length}`
      );
    }

    try {
      const {
        success: newWordsSuccess,
        data: newWords,
        error: newWordsError,
      } = await generateVocabularyByLetter({
        lang: "pl",
        letter,
        quantity: batchSize,
        level: currentLevel,
        existingWords,
        wordType,
      });

      if (!newWordsSuccess || !newWords || !newWords.length) {
        return { success: false, error: newWordsError };
      }

      const insertedNewWords = await db
        .insert(mainVocabularyTable)
        .values(newWords)
        .returning();

      const mappedNewWords = insertedNewWords.map((insertedWord) => ({
        id: insertedWord.id,
        word: insertedWord.word,
      }));

      const {
        success: translatedWordsSuccess,
        data: translatedWords,
        error: translatedWordsError,
      } = await generateTranslationWords(
        language,
        translationLanguage,
        mappedNewWords
      );

      if (!translatedWordsSuccess || !translatedWords || !newWords.length) {
        return { success: false, error: translatedWordsError };
      }

      const insertedTranslatedWords = await db
        .insert(translationVocabularyTable)
        .values(newWords)
        .returning();

      const mappedTranslatedWords = insertedTranslatedWords.map(
        (insertedWord) => ({
          id: insertedWord.id,
          word: insertedWord.word,
        })
      );

      const {
        success: translationsSuccess,
        data: translationsConnections,
        error: translationsError,
      } = await generateTranslationConnections(
        mappedNewWords,
        mappedTranslatedWords
      );

      if (
        !translationsSuccess ||
        !translationsConnections ||
        !translationsConnections.length
      ) {
        return { success: false, error: translationsError };
      }

      totalGenerated += batchSize;

      if (log) {
        console.log(
          `✅ Added ${mappedNewWords.length} new words for letter "${letter}" | Total so far: ${totalGenerated}`
        );
      }
    } catch (error) {
      console.error(`❌ Error generating for letter "${letter}":`, error);
    }

    // Delay before next batch
    if (delayMs > 0) {
      if (log) console.log(`⏱ Waiting ${delayMs / 1000}s...`);
      await sleep(delayMs);
    }
  }

  if (log) {
    console.log("🧹 Running post-generation cleanups...");
  }

  await removeDuplicatesFromTable("pl");
  await removeDuplicatesFromTable("ru");

  if (log) {
    console.log("🔍 Running quality check...");
  }

  // const issues = await checkGeneratedDataQuality();

  // if (!issues.length) {
  //   console.log("🎉 All looks clean!");
  // } else {
  //   console.warn(`⚠️ Found ${issues.length} potential issue(s).`);
  // }
};
