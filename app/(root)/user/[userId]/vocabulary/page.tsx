import Link from "next/link";
import { ArrowRight, BookOpen, User } from "lucide-react";
import { db } from "@/db";
import { eq, and, count } from "drizzle-orm";
import { languagePairs, SUPPORTED_LANGUAGES_CODES } from "@/constants";
import { userWordsTables } from "@/constants/tables";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserVocabularyHub = async ({ params }: PageProps) => {
  const { userId } = await params;

  const user = await getUserFromSession();

  if (user.id !== userId) {
    redirect("/user/dashboard");
  }

  const languageCounts = await Promise.all(
    SUPPORTED_LANGUAGES_CODES.map(async (langCode) => {
      const userWordsTable = userWordsTables[langCode];

      const result = await db
        .select({ value: count() })
        .from(userWordsTable)
        .where(and(eq(userWordsTable.userId, userId)));

      return {
        code: langCode,
        count: result[0]?.value || 0,
      };
    })
  );

  // Create a map of language codes to their word counts
  const languageCountMap = Object.fromEntries(
    languageCounts.map((item) => [item.code, item.count])
  );

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {user.name}&apos;s Vocabulary Collections
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Select a language pair to explore your personal vocabulary
          collections.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languagePairs.map((pair) => (
            <Link
              key={pair.code}
              href={`/user/${userId}/vocabulary/${pair.code}`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all hover:border-purple-300 h-full">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                      <h2 className="font-semibold text-lg text-gray-900">
                        {pair.source.name} to {pair.target.name}
                      </h2>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-4">
                      View your {pair.source.name} words with their{" "}
                      {pair.target.name} translations
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="bg-purple-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">
                          {pair.source.name} Words
                        </div>
                        <div className="text-lg font-semibold text-purple-700">
                          {languageCountMap[pair.source.code] || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserVocabularyHub;
