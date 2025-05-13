import Link from "next/link";
import { count } from "drizzle-orm";
import { ArrowRight, BookOpen, Languages } from "lucide-react";

import { db } from "@/db";
import { languagePairs, SUPPORTED_LANGUAGES_CODES } from "@/constants";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { getVocabTable } from "@/lib/utils";

const VocabularyHubPage = async () => {
  // Get counts for each supported language
  const [user, ...languageCounts] = await Promise.all([
    getUserFromSession(),
    ...SUPPORTED_LANGUAGES_CODES.map(async (langCode) => {
      const vocabTable = getVocabTable(langCode);

      const result = await db.select({ value: count() }).from(vocabTable);

      return {
        code: langCode,
        count: result[0]?.value || 0,
      };
    }),
  ]);

  // Create a map of language codes to their word counts
  const languageCountMap = Object.fromEntries(
    languageCounts.map((item) => [item.code, item.count])
  );

  // Filter language pairs based on user's learning languages
  const userLanguagePairs = languagePairs.filter((pair) =>
    user.learningLanguages.includes(pair.source.code)
  );

  // Check if user has any language pairs
  const hasLanguagePairs = userLanguagePairs.length > 0;

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Languages className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Vocabulary Collections
          </h1>
        </div>

        {hasLanguagePairs ? (
          <>
            <p className="text-gray-600 mb-8">
              Select a language pair to explore vocabulary translations. Each
              collection shows words from the source language with their
              translations in the target language.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLanguagePairs.map((pair) => (
                <Link
                  key={pair.code}
                  href={`/vocabulary/${pair.code}`}
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
                          View {pair.source.name} words with their{" "}
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
                          <div className="bg-purple-50 p-3 rounded-md">
                            <div className="text-xs text-gray-500">
                              {pair.target.name} Words
                            </div>
                            <div className="text-lg font-semibold text-purple-700">
                              {languageCountMap[pair.target.code] || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-purple-50 rounded-full p-6 mb-6">
              <Languages className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No languages added yet
            </h2>
            <p className="text-gray-600 max-w-md mb-8">
              You haven&apos;t added any languages to learn. Start your language
              learning journey by adding your first language.
            </p>
            <Link
              href="/languages"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Add a language
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyHubPage;
