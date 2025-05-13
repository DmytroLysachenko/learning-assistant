import { Suspense } from "react";
import { eq, count, inArray, and } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";
import { redirect } from "next/navigation";

import VocabularyTable from "@/components/vocabulary/VocabularyTable";
import { SUPPORTED_LANGUAGES, WORD_TYPES } from "@/constants";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import {
  buildWhereClause,
  getLanguageData,
  getSortOrder,
  parseSearchParams,
} from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";

interface PageProps {
  params: Promise<{
    userId: string;
    langPair: string;
  }>;
  searchParams: Promise<{
    page?: string;
    size?: string;
    filter?: string;
    wordType?: string;
    sort?: string;
    dir?: string;
  }>;
}

const UserVocabularyPage = async ({ params, searchParams }: PageProps) => {
  const [
    { userId, langPair },
    user,
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

  const [primaryWordsCount, usersPrimaryVocabWordsIds] = await Promise.all([
    db
      .select({ value: count() })
      .from(userWordsTable)
      .where(eq(userWordsTable.userId, userId))
      .then((res) => res[0].value),
    db
      .select({ wordId: userWordsTable.wordId })
      .from(userWordsTable)
      .where(eq(userWordsTable.userId, userId))
      .then((res) => res.map((item) => item.wordId)),
  ]);

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

  const [userWords, results, totalCountResult] = await Promise.all([
    db.select().from(userWordsTable).where(eq(userWordsTable.userId, userId)),
    dataQuery,
    countQueryBase.where(
      inArray(primaryVocabTable.id, usersPrimaryVocabWordsIds)
    ),
  ]);

  const totalCount = totalCountResult[0]?.value || 0;

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

  const userName = user.name;

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userName}&apos;s Vocabulary
            </h1>
            <p className="text-gray-600">
              Personal vocabulary collection for{" "}
              {SUPPORTED_LANGUAGES[primaryLanguage]}-
              {SUPPORTED_LANGUAGES[secondaryLanguage]} language pair
            </p>
          </div>
          <Link href={`/user/${userId}/vocabulary`}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900">Total Words</h3>
            <p className="text-3xl font-bold text-purple-600">
              {primaryWordsCount}
            </p>
          </div>
        </div>
      </div>

      {/* {typeCounts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Word Type Statistics
          </h2>
          <Suspense fallback={            <div className="flex justify-center items-center h-[300px]">
              <Loader className="animate-spin text-primary size-8" />
            </div>}>
            <WordTypeStats
              typeCounts={typeCounts}
              language={SUPPORTED_LANGUAGES[lang1.code]}
            />
          </Suspense>
        </div>
      )} */}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {SUPPORTED_LANGUAGES[primaryLanguage]}-
          {SUPPORTED_LANGUAGES[secondaryLanguage]} Vocabulary
        </h2>

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
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            userId={userId}
            isUserVocabulary={true}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default UserVocabularyPage;
