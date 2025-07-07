import { LanguageWordType } from "@/db/types";
import { LanguageCodeType, VocabTable, WordType } from "@/types";
import { ilike, and, eq } from "drizzle-orm";

export const buildWhereClause = (
  vocabTable: VocabTable,
  filter: string,
  wordType: LanguageWordType[LanguageCodeType][WordType] | undefined
) => {
  const filterClause = filter
    ? ilike(vocabTable.word, `%${filter}%`)
    : undefined;

  const typeClause = wordType ? eq(vocabTable.type, wordType) : undefined;

  return and(filterClause, typeClause);
};
