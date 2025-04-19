import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function weightedRandomType(weights: Record<string, number>) {
  const entries = Object.entries(weights);
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
