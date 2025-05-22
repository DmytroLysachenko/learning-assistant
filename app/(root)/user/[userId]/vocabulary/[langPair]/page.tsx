import { Suspense } from "react";
import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

import { SUPPORTED_LANGUAGES } from "@/constants";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getLanguageData, parseSearchParams } from "@/lib/utils";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import UserVocabularyTable from "@/components/vocabulary/UserVocabularyTable";

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
  const [{ langPair, userId }, parsedSearchParams] = await Promise.all([
    params,
    parseSearchParams(searchParams),
  ]);

  const { name: userName } = await getUserFromSession();

  const { primaryLanguage, secondaryLanguage, userWordsTable } =
    getLanguageData(langPair);

  const [primaryWordsCount] = await Promise.all([
    db
      .select({ value: count() })
      .from(userWordsTable)
      .where(eq(userWordsTable.userId, userId))
      .then((res) => res[0].value || 0),
  ]);

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
          <UserVocabularyTable
            langPair={langPair}
            userId={userId}
            searchParams={parsedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default UserVocabularyPage;
