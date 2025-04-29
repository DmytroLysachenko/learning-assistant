import { z } from "zod";

// === Enums ===
export const difficultyEnum = z.enum([
  "A0",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
]);

export const polishTypeEnum = z.enum([
  "rzeczownik",
  "czasownik",
  "przymiotnik",
  "liczebnik",
  "zaimek",
  "przysłówek",
  "przyimek",
  "spójnik",
  "partykuła",
]);

export const russianTypeEnum = z.enum([
  "существительное",
  "глагол",
  "прилагательное",
  "числительное",
  "местоимение",
  "наречие",
  "предлог",
  "союз",
  "частица",
]);

// === Shared Word Shape Generator ===
const baseWordSchema = z.object({
  word: z.string().min(1).describe("The word itself in its basic form"),
  example: z
    .string()
    .min(1)
    .describe(
      "An example sentence with word used in it in corresponding language"
    ),
  comment: z
    .string()
    .optional()
    .describe("Optional comment with word meaning in corresponding language"),
  difficulty: difficultyEnum,
});

export const wordSchemas = {
  pl: baseWordSchema.extend({
    type: polishTypeEnum.describe("Word type in corresponding language"),
  }),
  ru: baseWordSchema.extend({
    type: russianTypeEnum.describe("Word type in corresponding language"),
  }),
};

export const wordsValidationSchemas = {
  pl: wordSchemas.pl.extend({
    id: z.string().describe("Original unchangeable word id."),
  }),
  ru: wordSchemas.ru.extend({
    id: z.string().describe("Original unchangeable word id."),
  }),
};

// === Translation Schema ===
export const aiTranslationSchema = z.object({
  wordId1: z.string().describe("Id of the primary language word"),
  wordId2: z.string().describe("Id of the translation language word"),
});
