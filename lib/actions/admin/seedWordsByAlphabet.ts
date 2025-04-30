"use server";

import { ilike } from "drizzle-orm";
import { ALPHABETS } from "@/constants";

import { db } from "@/db";
import { generateVocabularyByLetter } from "@/lib/ai/generators";
import { getShuffledLetterCombos, getVocabTable, sleep } from "@/lib/utils";
import { SeedWordsOptions } from "@/types";

export const seedWordsByAlphabet = async ({
  batchSize = 10,
  total = 100,
  delayMs = 5000,
  wordType = "noun",
  language = "pl",
  log = true,
}: SeedWordsOptions) => {
  let totalGenerated = 0;
  try {
    const mainVocabularyTable = getVocabTable(language);
    const combos = getShuffledLetterCombos(ALPHABETS[language]);

    for (const letter of combos) {
      try {
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

        const {
          success: newWordsSuccess,
          data: newWords,
          error: newWordsError,
        } = await generateVocabularyByLetter({
          language,
          letter,
          quantity: batchSize,
          existingWords,
          wordType,
        });

        if (!newWordsSuccess || !newWords || !newWords.length) {
          throw new Error(String(newWordsError) ?? "No words generated");
        }

        await db.insert(mainVocabularyTable).values(newWords);
        totalGenerated += newWords.length;

        if (log) {
          console.log(
            `✅ Added ${newWords.length} new words for letter "${letter}" | Total so far: ${totalGenerated}`
          );
        }

        if (totalGenerated >= total) {
          return { success: true };
        }

        if (delayMs > 0) {
          if (log) console.log(`⏱ Waiting ${delayMs / 1000}s...`);
          await sleep(delayMs);
        }
      } catch (error) {
        console.error(`❌ Error generating for letter "${letter}":`, error);
        continue;
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }

  return { success: true, data: totalGenerated };
};
