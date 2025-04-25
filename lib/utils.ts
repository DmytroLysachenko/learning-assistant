import { translationTableMap, vocabTableMap } from "@/db/schema";
import { LanguageCodeType } from "@/types";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function weightedRandomType(weights: Record<string, number>) {
  const entries = Object.entries(weights);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const total = entries.reduce((sum, [_, w]) => sum + w, 0);
  const rand = Math.random() * total;
  let acc = 0;

  for (const [type, weight] of entries) {
    acc += weight;
    if (rand < acc) return type;
  }

  return entries[0][0]; // fallback
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getTranslationTable = (
  language1: LanguageCodeType,
  language2: LanguageCodeType
) => {
  const pairKey = [language1, language2]
    .sort()
    .join("_") as keyof typeof translationTableMap;
  const table = translationTableMap[pairKey];
  if (!table)
    throw new Error(`No translation table for pair: ${language1}-${language2}`);
  return table;
};

export const getVocabTable = (language: LanguageCodeType) => {
  const table = vocabTableMap[language];
  if (!table) throw new Error(`No vocabulary table for: ${language}`);
  return table;
};

export const getShuffledLetterCombos = (alphabet: string[]) => {
  const combos: string[] = [];

  for (const l1 of alphabet) {
    for (const l2 of alphabet) {
      combos.push(`${l1}${l2}`);
    }
  }

  // Fisher-Yates shuffle
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }

  return combos;
};
