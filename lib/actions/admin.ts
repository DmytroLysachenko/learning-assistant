"use server";

import { db } from "@/db";

import {
  ALPHABETS,
  WORD_TYPES_PROMPTS,
  WORDS_LANGUAGE_LEVELS,
} from "@/constants";
import { getShuffledLetterCombos, sleep } from "../utils";
import { generateVocabularyByLetter } from "../ai/generators/vocabularyByAlphabet";
import { generateTranslationWords } from "../ai/generators/translator";

import { generateTranslationConnections } from "../ai/generators/connectionMapper";
import { SeedWordsOptions, WordType } from "@/types";
import { generateVocabularyByTopic } from "../ai/generators/vocabularyByTopic";
import { removeDuplicatesFromTable } from "./checks/vocabulary";
import { ilike } from "drizzle-orm";
import { translationTables, vocabTables } from "@/db/schema";

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
      ? (Object.keys(WORD_TYPES_PROMPTS[language])[
          Math.floor(Math.random() * Object.keys(WORD_TYPES_PROMPTS).length)
        ] as WordType)
      : wordType;

    try {
      const {
        success: newWordsSuccess,
        data: newWords,
        error: newWordsError,
      } = await generateVocabularyByTopic({
        language,
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
  total = 100,
  delayMs = 5000,
  wordType,
  language = "pl",
  translationLanguage = "ru",
  log = true,
}: SeedWordsOptions) => {
  let totalGenerated = 0;

  const mainVocabularyTable = vocabTables[language];
  const translationVocabularyTable = vocabTables[translationLanguage];

  const [firstLang, secondLang] = [language, translationLanguage].sort();
  const key = `${firstLang}_${secondLang}` as keyof typeof translationTables;

  // Find the applicable translation table
  const translationsTable = translationTables[key];

  if (!translationsTable) {
    return {
      success: false,
      error: `Translation table for ${firstLang} and ${secondLang} not found.`,
    };
  }

  const combos = getShuffledLetterCombos(ALPHABETS[language]);

  for (const letter of combos) {
    const existingWords = await db
      .select({ word: mainVocabularyTable.word })
      .from(mainVocabularyTable)
      .where(ilike(mainVocabularyTable.word, `%${letter}%`))
      .then((words) => words.map((w) => w.word));

    if (log) {
      console.log(
        `🔤 Generating for letter "${letter}" | Existing: ${existingWords.length}`
      );
    }

    try {
      const { success: newWordsSuccess, data: newWords } =
        await generateVocabularyByLetter({
          language: "pl",
          letter,
          quantity: batchSize,
          existingWords,
          wordType,
        });

      if (!newWordsSuccess || !newWords || !newWords.length) {
        if (log)
          console.warn(
            `⚠️ Skipped "${letter}" — Translation connections failed.`
          );
        continue;
      }

      const insertedNewWords = await db
        .insert(mainVocabularyTable)
        .values(newWords)
        .returning();

      console.log(insertedNewWords.length);

      const mappedNewWords = insertedNewWords.map((insertedWord) => ({
        id: insertedWord.id,
        word: insertedWord.word,
      }));

      const { success: translatedWordsSuccess, data: translatedWords } =
        await generateTranslationWords(
          language,
          translationLanguage,
          mappedNewWords
        );

      if (
        !translatedWordsSuccess ||
        !translatedWords ||
        !translatedWords.length
      ) {
        if (log) console.warn(`⚠️ Skipped "${letter}" — Translation failed.`);
        continue;
      }

      const insertedTranslatedWords = await db
        .insert(translationVocabularyTable)
        .values(translatedWords)
        .returning();

      console.log(insertedTranslatedWords.length);

      const mappedTranslatedWords = insertedTranslatedWords.map(
        (insertedWord) => ({
          id: insertedWord.id,
          word: insertedWord.word,
        })
      );

      const { success: translationsSuccess, data: translationsConnections } =
        await generateTranslationConnections(
          mappedNewWords,
          mappedTranslatedWords
        );

      if (
        !translationsSuccess ||
        !translationsConnections ||
        !translationsConnections.length
      ) {
        if (log)
          console.warn(
            `⚠️ Skipped "${letter}" — Translation connections failed.`
          );
        continue;
      }

      const connections = await db
        .insert(translationsTable)
        .values(translationsConnections)
        .returning();
      console.log(connections.length);
      totalGenerated += batchSize;

      if (log) {
        console.log(
          `✅ Added ${mappedNewWords.length} new words for letter "${letter}" | Total so far: ${totalGenerated}`
        );
      }
    } catch (error) {
      console.error(`❌ Error generating for letter "${letter}":`, error);
      continue;
    }

    if (totalGenerated >= total) {
      if (log) {
        console.log(`✅ Generated ${totalGenerated} words, completing...`);
        console.log("🧹 Running post-generation cleanups...");
      }

      await removeDuplicatesFromTable(language);
      await removeDuplicatesFromTable(translationLanguage);

      return { success: true };
    }

    // Delay before next batch
    if (delayMs > 0) {
      if (log) console.log(`⏱ Waiting ${delayMs / 1000}s...`);
      await sleep(delayMs);
    }
  }

  if (log) {
    console.log(`✅ Generated ${totalGenerated} words, completing...`);
    console.log("🧹 Running post-generation cleanups...");
  }

  await removeDuplicatesFromTable(language);
  await removeDuplicatesFromTable(translationLanguage);

  return { success: true };
  // if (log) {
  //   console.log("🔍 Running quality check...");
  // }

  // const issues = await checkGeneratedDataQuality();

  // if (!issues.length) {
  //   console.log("🎉 All looks clean!");
  // } else {
  //   console.warn(`⚠️ Found ${issues.length} potential issue(s).`);
  // }
};
