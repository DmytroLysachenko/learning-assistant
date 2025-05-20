import { db } from "@/db";
import { and, count, eq, inArray } from "drizzle-orm";
import { getLanguageData, getSortOrder, buildWhereClause } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import VocabularyTable from "./VocabularyTable";
import { WordType } from "@/types";
import { WORD_TYPES } from "@/constants";
import { redirect } from "next/navigation";

interface Props {
  langPair: string;
  userId: string;
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

const UserVocabularyTableWrapper = async ({
  langPair,
  userId,
  searchParams,
}: Props) => {
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
  if (user.id !== userId) {
    redirect("/user/dashboard");
  }

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

  const localWordType = WORD_TYPES[primaryLanguage][wordType];

  const whereClause = buildWhereClause(
    primaryVocabTable,
    filter,
    localWordType
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

  const usersPrimaryVocabWordsIds = await db
    .select({ wordId: userWordsTable.wordId })
    .from(userWordsTable)
    .where(eq(userWordsTable.userId, userId))
    .then((res) => res.map((item) => item.wordId));

  const dataQuery = db
    .select({
      translationTable,
      primaryVocabTable: primaryVocabTable,
      secondaryVocabTable: secondaryVocabTable,
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
    .where(
      and(whereClause, inArray(primaryVocabTable.id, usersPrimaryVocabWordsIds))
    )
    .orderBy(getSortOrder(sortField, sortDirection, primaryVocabTable))
    .limit(pageSize)
    .offset(offset);

  const [userWords, results, totalCount] = await Promise.all([
    db.select().from(userWordsTable).where(eq(userWordsTable.userId, userId)),
    dataQuery,
    countQueryBase
      .where(inArray(primaryVocabTable.id, usersPrimaryVocabWordsIds))
      .then((res) => res[0].value || 0),
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
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      userId={user.id}
    />
  );
};

export default UserVocabularyTableWrapper;
