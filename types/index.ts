import { vocabTables } from "@/db/schema";
import { aiTranslationSchema } from "@/lib/validations/ai";
import { z } from "zod";

export type LanguageLevelsType = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type WordType =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "numeral"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "particle";

export type LanguageCodeType = keyof typeof vocabTables;

export type TranslationType = z.infer<typeof aiTranslationSchema>;

export interface ShortWordEntry {
  id: string;
  word: string;
}

export interface LanguageOption {
  value: LanguageCodeType;
  label: string;
}

export interface OperationStatus {
  isGeneratingByTopic: boolean;
  isGeneratingByAlphabet: boolean;
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  isValidating: boolean;
}

export interface SeedWordsOptions {
  total: number;
  batchSize?: number;
  delayMs?: number;
  randomizeType?: boolean;
  randomizeCategory?: boolean;
  level?: LanguageLevelsType;
  wordType?: WordType;
  log?: boolean;
  language: LanguageCodeType;
  translationLanguage: LanguageCodeType;
}

export interface Word {
  id: string;
  word: string;
  example: string | null;
  type: string;
  difficulty: string | null;
  createdAt: Date | null;
  comment: string | null;
  language: string;
  primary?: boolean;
}

export interface WordPair {
  id: string;
  words: Word[];
}

export type SortField = "word" | "type" | "difficulty";
export type SortDirection = "asc" | "desc";
