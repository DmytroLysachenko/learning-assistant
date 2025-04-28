import {
  pl_ru_translations,
  plVocabulary,
  ruVocabulary,
  userPolishWords,
  userRuWords,
} from "@/db/schema";

export const vocabTables = {
  pl: plVocabulary,
  ru: ruVocabulary,
};

export const translationTables = {
  pl_ru: pl_ru_translations,
};

export const userWordsTables = {
  pl: userPolishWords,
  ru: userRuWords,
};
