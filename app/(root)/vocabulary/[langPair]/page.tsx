import { count, eq } from "drizzle-orm";
import { Suspense } from "react";

import VocabularyTable from "@/components/vocabulary/VocabularyTable";
import { SUPPORTED_LANGUAGES, WORD_TYPES } from "@/constants";
import { db } from "@/db";
import {
  getLanguageData,
  parseSearchParams,
  getSortOrder,
  buildWhereClause,
} from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { Loader } from "lucide-react";

interface VocabularyPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    filter?: string;
    wordType?: string;
    sort?: string;
    dir?: string;
  }>;
  params: Promise<{ langPair: string }>;
}

const VocabularyPage = async ({
  searchParams,
  params,
}: VocabularyPageProps) => {
  const [
    { langPair },
    { id: userId },
    {
      currentPage,
      pageSize,
      filter,
      sortField,
      wordType,
      sortDirection,
      offset,
    },
  ] = await Promise.all([
    params,
    getUserFromSession(),
    parseSearchParams(searchParams),
  ]);

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

  const [primaryWordsCount, secondaryWordsCount] = await Promise.all([
    db
      .select({ value: count() })
      .from(primaryVocabTable)
      .then((res) => res[0].value || 0),
    db
      .select({ value: count() })
      .from(secondaryVocabTable)
      .then((res) => res[0].value || 0),
  ]);

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

  // Build final filtered + sorted + paginated query
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
    .where(whereClause)
    .orderBy(getSortOrder(sortField, sortDirection, primaryVocabTable))
    .limit(pageSize)
    .offset(offset);

  const [userWords, results, totalCount, totalFilteredCount] =
    await Promise.all([
      db.select().from(userWordsTable).where(eq(userWordsTable.userId, userId)),
      dataQuery,
      countQueryBase.then((res) => res[0].value),
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
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {SUPPORTED_LANGUAGES[primaryLanguage]} Words
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {primaryWordsCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {SUPPORTED_LANGUAGES[secondaryLanguage]} Words
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {secondaryWordsCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Translations</h3>
          <p className="text-3xl font-bold text-purple-600">{totalCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vocabulary</h2>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[300px]">
              <Loader className="animate-spin text-primary size-8" />
            </div>
          }
        >
          <VocabularyTable
            primaryLanguage={primaryLanguage}
            wordPairs={entries}
            totalCount={totalFilteredCount}
            currentPage={currentPage}
            pageSize={pageSize}
            userId={userId}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default VocabularyPage;
