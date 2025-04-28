import { ilike } from "drizzle-orm";

import { ALPHABETS } from "@/constants";
import { translationTables, vocabTables } from "@/constants/tables";
import { db } from "@/db";
import {
  generateTranslationConnections,
  generateTranslationWords,
  generateVocabularyByLetter,
} from "@/lib/ai/generators";
import { getShuffledLetterCombos, sleep } from "@/lib/utils";
import { SeedWordsOptions } from "@/types";
import { removeDuplicatesFromTable } from "../checks";

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

      await Promise.all([
        removeDuplicatesFromTable(language),
        removeDuplicatesFromTable(translationLanguage),
      ]);

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

  await Promise.all([
    removeDuplicatesFromTable(language),
    removeDuplicatesFromTable(translationLanguage),
  ]);

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
