import { Suspense } from "react";
import { eq, count, inArray, and } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
  const { userId, langPair } = await params;

  const user = await getUserFromSession();

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

  const {
    currentPage,
    pageSize,
    filter,
    sortField,
    wordType,
    sortDirection,
    offset,
  } = await parseSearchParams(searchParams);

  const localWordType = WORD_TYPES[primaryLanguage][wordType];

  // Count of user's words in each language
  const primaryWordsCount = await db
    .select({ value: count() })
    .from(userWordsTable)
    .where(eq(userWordsTable.userId, userId))
    .then((res) => res[0].value);

  // Filtering condition - filter on the primary language
  const whereClause = buildWhereClause(
    primaryVocabTable,
    filter,
    localWordType
  );

  const usersPrimaryVocabWordsIds = await db
    .select({ wordId: userWordsTable.wordId })
    .from(userWordsTable)
    .where(eq(userWordsTable.userId, userId))
    .then((res) => res.map((item) => item.wordId));

  // Count translations with or without filter
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
  const totalCountResult = await countQueryBase.where(
    inArray(primaryVocabTable.id, usersPrimaryVocabWordsIds)
  );

  const totalCount = totalCountResult[0]?.value || 0;

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
    .where(
      and(whereClause, inArray(primaryVocabTable.id, usersPrimaryVocabWordsIds))
    )
    .orderBy(getSortOrder(sortField, sortDirection, primaryVocabTable))
    .limit(pageSize)
    .offset(offset);

  const results = await dataQuery;

  const entries = results.map((entry) => ({
    id: entry.translationTable.id,
    primaryWord: {
      id: entry.primaryVocabTable!.id,
      word: entry.primaryVocabTable!.word,
      example: entry.primaryVocabTable!.example,
      type: entry.primaryVocabTable!.type,
      difficulty: entry.primaryVocabTable!.difficulty,
      createdAt: entry.primaryVocabTable!.createdAt,
      comment: entry.primaryVocabTable!.comment,
      language: primaryLanguage,
    },
    secondaryWord: {
      id: entry.secondaryVocabTable!.id,
      word: entry.secondaryVocabTable!.word,
      example: entry.secondaryVocabTable!.example,
      type: entry.secondaryVocabTable!.type,
      difficulty: entry.secondaryVocabTable!.difficulty,
      createdAt: entry.secondaryVocabTable!.createdAt,
      comment: entry.secondaryVocabTable!.comment,
      language: secondaryLanguage,
    },
  }));

  // Get user information - in a real app, you'd fetch this from your users table
  const userName = "User"; // Replace with actual user name when available

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
          <Suspense fallback={<div>Loading statistics...</div>}>
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
        <Suspense fallback={<div>Loading vocabulary...</div>}>
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
