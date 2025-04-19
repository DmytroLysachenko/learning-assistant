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
  "частица",
]);

// === Shared Word Shape Generator ===
const baseWordSchema = z.object({
  word: z
    .string()
    .min(1)
    .describe(
      "The word itself in its basic form (for example 'kot', but not 'koty', 'spać' but not 'śpią', 'pięć' but not 'piąty')"
    ),
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

const aiPolishWordSchema = baseWordSchema.extend({
  type: polishTypeEnum.describe("Word type in corresponding language"),
});

const aiRussianWordSchema = baseWordSchema.extend({
  type: russianTypeEnum.describe("Word type in corresponding language"),
});

export const wordSchemas = {
  pl: aiPolishWordSchema,
  ru: aiRussianWordSchema,
};

// === Translation Schema ===
export const aiTranslationSchema = z.object({
  wordId1: z.string().describe("Id of the first word"),
  wordId2: z.string().describe("Id of the second word"),
});
