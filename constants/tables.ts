import {
  en_pl_translations,
  pl_ru_translations,
  plVocabulary,
  ruVocabulary,
  userPolishWords,
  userRuWords,
} from "@/db/schema";
import { enVocabulary, userEnglishWords } from "@/db/schema/en";

export const vocabTables = {
  pl: plVocabulary,
  ru: ruVocabulary,
  en: enVocabulary,
};

export const translationTables = {
  pl_ru: pl_ru_translations,
  en_pl: en_pl_translations,
};

export const userWordsTables = {
  pl: userPolishWords,
  ru: userRuWords,
  en: userEnglishWords,
};
