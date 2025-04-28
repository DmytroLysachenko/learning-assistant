import { VocabTable } from "@/types";
import { asc, desc } from "drizzle-orm";

export function getSortOrder(
  sortField: string,
  sortDirection: "asc" | "desc",
  primaryVocabTable: VocabTable
) {
  const column =
    sortField === "type"
      ? primaryVocabTable.type
      : sortField === "difficulty"
      ? primaryVocabTable.difficulty
      : primaryVocabTable.word;

  return sortDirection === "asc" ? asc(column) : desc(column);
}
