"use server";

import { WORDS_LANGUAGE_LEVELS } from "@/constants";
import { db } from "@/db";
import { generateVocabularyByTopic } from "@/lib/ai/generators";
import { getVocabTable, sleep } from "@/lib/utils";
import { SeedWordsOptions } from "@/types";

export const seedWordsByTopic = async ({
  total,
  batchSize = 10,
  delayMs = 5000,
  level,
  wordType = "noun",
  language = "pl",
  log = true,
}: SeedWordsOptions) => {
  const batches = Math.ceil(total / batchSize);
  let totalGenerated = 0;
  try {
    const mainVocabularyTable = getVocabTable(language);

    if (log) {
      console.log(`🚀 Starting to seed ${total} words by topic...`);
    }

    for (let i = 0; i < batches; i++) {
      const currentLevel =
        level ||
        WORDS_LANGUAGE_LEVELS[
          Math.floor(Math.random() * WORDS_LANGUAGE_LEVELS.length)
        ];

      try {
        const {
          success: newWordsSuccess,
          data: newWords,
          error: newWordsError,
        } = await generateVocabularyByTopic({
          language,
          quantity: batchSize,
          level: currentLevel,
          wordType,
        });

        if (!newWordsSuccess || !newWords || !newWords.length) {
          throw new Error(String(newWordsError) ?? "No words generated");
        }

        await db.insert(mainVocabularyTable).values(newWords).returning();

        totalGenerated += batchSize;

        if (log) {
          console.log(
            `✅ Batch ${i + 1} complete | Total so far: ${totalGenerated} words`
          );
        }
      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error);
        continue;
      }

      if (log) console.log(`⏱ Waiting ${delayMs / 1000}s before next batch...`);
      await sleep(delayMs);
    }

    return { success: true, data: totalGenerated };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }

  // const issues = await checkGeneratedDataQuality();

  // if (!issues.length) {
  //   console.log("🎉 All looks clean!");
  // } else {
  //   console.warn(`⚠️ Found ${issues.length} potential issue(s).`);
  // }
};
