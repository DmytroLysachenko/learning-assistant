import Link from "next/link";
import { ArrowRight, BookOpen, Languages } from "lucide-react";
import { db } from "@/db";
import { plVocabulary, ruVocabulary, pl_ru_translations } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SUPPORTED_LANGUAGES } from "@/constants";

// Generate all possible language pair combinations
const generateLanguagePairs = () => {
  const languages = Object.entries(SUPPORTED_LANGUAGES);
  const pairs = [];

  for (let i = 0; i < languages.length; i++) {
    for (let j = 0; j < languages.length; j++) {
      if (i !== j) {
        pairs.push({
          code: `${languages[i][0]}-${languages[j][0]}`,
          name: `${languages[i][1]}-${languages[j][1]}`,
          source: {
            code: languages[i][0],
            name: languages[i][1],
          },
          target: {
            code: languages[j][0],
            name: languages[j][1],
          },
        });
      }
    }
  }

  return pairs;
};

export default async function VocabularyHub() {
  const languagePairs = generateLanguagePairs();

  // Get counts for each language and translations
  const [polishCount, russianCount] = await Promise.all([
    db.select({ value: sql<number>`count(*)` }).from(plVocabulary),
    db.select({ value: sql<number>`count(*)` }).from(ruVocabulary),
    db.select({ value: sql<number>`count(*)` }).from(pl_ru_translations),
  ]);

  // Create a map of language codes to their word counts
  const languageCounts = {
    pl: polishCount[0]?.value || 0,
    ru: russianCount[0]?.value || 0,
  };

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Languages className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Vocabulary Collections
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Select a language pair to explore vocabulary translations. Each
          collection shows words from the source language with their
          translations in the target language.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languagePairs.map((pair) => (
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
                          {languageCounts[
                            pair.source.code as keyof typeof languageCounts
                          ].toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">
                          {pair.target.name} Words
                        </div>
                        <div className="text-lg font-semibold text-purple-700">
                          {languageCounts[
                            pair.target.code as keyof typeof languageCounts
                          ].toLocaleString()}
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
}
