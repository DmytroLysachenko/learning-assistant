import { Languages, Loader } from "lucide-react";

import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_CODES } from "@/constants";
import { getVocabTable } from "@/lib/utils";
import { db } from "@/db";
import { count } from "drizzle-orm";
import { LanguageCodeType } from "@/types";
import LanguageCard from "@/components/languages/LanguageCard";
import { Suspense } from "react";

const LanguagesHubPage = async () => {
  const user = await getUserFromSession();

  const userLanguages: LanguageCodeType[] = [];

  if (user.learningLanguages) {
    userLanguages.push(...user.learningLanguages);
  }

  const languages = await Promise.all(
    Object.values(SUPPORTED_LANGUAGES_CODES).map(async (language) => {
      const languageVocabTable = getVocabTable(language);
      const wordCount = await db
        .select({ count: count() })
        .from(languageVocabTable)
        .then((res) => res[0]?.count || 0);

      return {
        code: language,
        name: SUPPORTED_LANGUAGES[language],
        wordCount,
      };
    })
  );

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Languages className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Languages Collections
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Select a language you would like to learn with us.
        </p>

        <Suspense fallback={<Loader className="animate-spin" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((language) => (
              <LanguageCard
                userLanguages={userLanguages}
                key={language.code}
                language={language}
                userId={user.id}
              />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default LanguagesHubPage;
