import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getShuffledLetterCombos = (alphabet: string[]) => {
  const combos: string[] = [];

  for (const l1 of alphabet) {
    for (const l2 of alphabet) {
      combos.push(`${l1}${l2}`);
    }
  }

  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }

  return combos;
};
