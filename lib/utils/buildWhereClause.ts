import { VocabTable } from "@/types";
import { or, ilike } from "drizzle-orm";

export function buildWhereClause(
  primaryVocabTable: VocabTable,
  filter: string
) {
  return filter ? or(ilike(primaryVocabTable.word, `%${filter}%`)) : undefined;
}
