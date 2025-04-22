"use server";

import { vocabTables, vocabTablesNames } from "@/constants";
import { db } from "@/db";
import { translationTables } from "@/db/schema";
import { LanguageCodeType } from "@/types";
import { inArray } from "drizzle-orm";

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

// export const checkGeneratedDataQualityDynamic = async (
//   langs: LanguageCodeType[],
//   translationTables: TranslationTableMeta[]
// ) => {
//   const issues: string[] = [];
//   const vocabMaps: Record<LanguageCodeType, Map<string, any>> = {} as any;

//   for (const lang of langs) {
//     const vocabTable = vocabTables[lang];
//     const words = await db.select().from(vocabTable);
//     vocabMaps[lang] = new Map(words.map((w) => [w.id, w]));

//     for (const word of words) {
//       if (!word.word || word.word.length < 2) {
//         issues.push(
//           `${lang.toUpperCase()}: Word "${word.word}" seems invalid.`
//         );
//       }
//       if (!word.example || word.example.length < 4) {
//         issues.push(
//           `${lang.toUpperCase()}: Word "${
//             word.word
//           }" has a weak or missing example.`
//         );
//       }
//     }
//   }

//   for (const t of translationTables) {
//     const links = await db.select().from(t.table);

//     for (const link of links) {
//       const word1 = vocabMaps[t.lang1].get(link.wordId1);
//       const word2 = vocabMaps[t.lang2].get(link.wordId2);

//       if (!word1) {
//         issues.push(
//           `Translation issue: Missing ${t.lang1} word for ID ${link.wordId1}`
//         );
//       }
//       if (!word2) {
//         issues.push(
//           `Translation issue: Missing ${t.lang2} word for ID ${link.wordId2}`
//         );
//       }

//       if (word1?.word?.toLowerCase() === word2?.word?.toLowerCase()) {
//         issues.push(
//           `Translation warning: Identical word "${
//             word1?.word
//           }" in both ${t.lang1.toUpperCase()} and ${t.lang2.toUpperCase()}`
//         );
//       }

//       if (word1 && word2 && word1.difficulty !== word2.difficulty) {
//         issues.push(
//           `Difficulty mismatch between "${word1.word}" (${word1.difficulty}) and "${word2.word}" (${word2.difficulty})`
//         );
//       }
//     }
//   }

//   if (!issues.length) {
//     console.log(
//       "✅ All generated words and translations passed quality checks."
//     );
//   } else {
//     console.warn("⚠️ Issues found in vocabulary/translations:");
//     issues.forEach((issue) => console.warn("- " + issue));
//   }

//   return issues;
// };
