import { vocabTables } from "@/constants";
import { aiTranslationSchema } from "@/lib/validations/ai";
import { z } from "zod";

export type LanguageLevelsType = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type WordType =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "numeral"
  | "pronouns"
  | "prepositions"
  | "conjunctions"
  | "none";

export type LanguageCodeType = keyof typeof vocabTables;

export type TranslationType = z.infer<typeof aiTranslationSchema>;

export type ShortWordType = {
  id: string;
  word: string;
};
