import { WORD_TYPES_PROMPTS, WORDS_LANGUAGE_LEVELS } from "@/constants";
import { vocabTables } from "@/constants/tables";
import { db } from "@/db";
import {
  generateTranslationConnections,
  generateTranslationWords,
  generateVocabularyByTopic,
} from "@/lib/ai/generators";
import { sleep } from "@/lib/utils";
import { SeedWordsOptions, WordType } from "@/types";
import { removeDuplicatesFromTable } from "../checks";

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

  await Promise.all([
    removeDuplicatesFromTable(language),
    removeDuplicatesFromTable(translationLanguage),
  ]);

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
