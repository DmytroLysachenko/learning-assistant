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
  lang1: LanguageCodeType,
  lang2: LanguageCodeType
) => {
  const pairKey = [lang1, lang2]
    .sort()
    .join("_") as keyof typeof translationTableMap;
  const table = translationTableMap[pairKey];
  if (!table)
    throw new Error(`No translation table for pair: ${lang1}-${lang2}`);
  return table;
};

export const getVocabTable = (lang: LanguageCodeType) => {
  const table = vocabTableMap[lang];
  if (!table) throw new Error(`No vocabulary table for: ${lang}`);
  return table;
};
