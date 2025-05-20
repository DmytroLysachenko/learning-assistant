import { db } from "@/db";
import { count, eq } from "drizzle-orm";
import { getLanguageData, getSortOrder, buildWhereClause } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import VocabularyTable from "./VocabularyTable";
import { WordType } from "@/types";
import { WORD_TYPES } from "@/constants";

interface Props {
  langPair: string;
  searchParams: {
    currentPage: number;
    pageSize: number;
    filter: string;
    wordType: WordType;
    sortField: string;
    sortDirection: "asc" | "desc";
    offset: number;
  };
}

const VocabularyTableWrapper = async ({ langPair, searchParams }: Props) => {
  const user = await getUserFromSession();
  const {
    currentPage,
    pageSize,
    filter,
    sortField,
    wordType,
    sortDirection,
    offset,
  } = searchParams;

  const {
    primaryLanguage,
    secondaryLanguage,
    primaryVocabTable,
    secondaryVocabTable,
    translationTable,
    userWordsTable,
    primaryLanguageWordId,
    secondaryLanguageWordId,
  } = getLanguageData(langPair);

  const whereClause = buildWhereClause(
    primaryVocabTable,
    filter,
    WORD_TYPES[primaryLanguage][wordType]
  );

  const countQueryBase = db
    .select({ value: count() })
    .from(translationTable)
    .leftJoin(
      primaryVocabTable,
      eq(translationTable[primaryLanguageWordId], primaryVocabTable.id)
    )
    .leftJoin(
      secondaryVocabTable,
      eq(translationTable[secondaryLanguageWordId], secondaryVocabTable.id)
    );

  const [userWords, results, totalFilteredCount] = await Promise.all([
    db.select().from(userWordsTable).where(eq(userWordsTable.userId, user.id)),
    db
      .select({
        translationTable,
        primaryVocabTable,
        secondaryVocabTable,
      })
      .from(translationTable)
      .leftJoin(
        primaryVocabTable,
        eq(translationTable[primaryLanguageWordId], primaryVocabTable.id)
      )
      .leftJoin(
        secondaryVocabTable,
        eq(translationTable[secondaryLanguageWordId], secondaryVocabTable.id)
      )
      .where(whereClause)
      .orderBy(getSortOrder(sortField, sortDirection, primaryVocabTable))
      .limit(pageSize)
      .offset(offset),
    countQueryBase.where(whereClause).then((res) => res[0].value),
  ]);

  const entries = results.map(
    ({ primaryVocabTable, secondaryVocabTable, translationTable }) => ({
      id: translationTable.id,
      isLearning: userWords.some(
        (word) => word.wordId === primaryVocabTable!.id
      ),
      primaryWord: {
        id: primaryVocabTable!.id,
        word: primaryVocabTable!.word,
        example: primaryVocabTable!.example,
        type: primaryVocabTable!.type,
        difficulty: primaryVocabTable!.difficulty,
        createdAt: primaryVocabTable!.createdAt,
        comment: primaryVocabTable!.comment,
        language: primaryLanguage,
      },
      secondaryWord: {
        id: secondaryVocabTable!.id,
        word: secondaryVocabTable!.word,
        example: secondaryVocabTable!.example,
        type: secondaryVocabTable!.type,
        difficulty: secondaryVocabTable!.difficulty,
        createdAt: secondaryVocabTable!.createdAt,
        comment: secondaryVocabTable!.comment,
        language: secondaryLanguage,
      },
    })
  );

  return (
    <VocabularyTable
      primaryLanguage={primaryLanguage}
      wordPairs={entries}
      totalCount={totalFilteredCount}
      currentPage={currentPage}
      pageSize={pageSize}
      userId={user.id}
    />
  );
};

export default VocabularyTableWrapper;
