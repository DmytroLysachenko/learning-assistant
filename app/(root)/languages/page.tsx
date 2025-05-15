import { Languages, Loader } from "lucide-react";

import { Suspense } from "react";
import LanguagesList from "@/components/languages/LanguagesList";

const LanguagesHubPage = () => {
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

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[300px]">
              <Loader className="animate-spin text-primary size-8" />
            </div>
          }
        >
          <LanguagesList />
        </Suspense>
      </div>
    </div>
  );
};

export default LanguagesHubPage;
