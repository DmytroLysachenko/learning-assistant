import { translationTables, vocabTables } from "@/constants/tables";
import { LanguageCodeType } from "@/types";

export const getTranslationTable = (
  language1: LanguageCodeType,
  language2: LanguageCodeType
) => {
  const pairKey = [language1, language2]
    .sort()
    .join("_") as keyof typeof translationTables;
  const table = translationTables[pairKey];
  if (!table)
    throw new Error(`No translation table for pair: ${language1}-${language2}`);
  return table;
};

export const getVocabTable = (language: LanguageCodeType) => {
  const table = vocabTables[language];
  if (!table) throw new Error(`No vocabulary table for: ${language}`);
  return table;
};
