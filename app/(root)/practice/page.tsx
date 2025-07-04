import { Suspense } from "react";
import { Languages, BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LanguageCardsList from "@/components/practice/LanguageCardsList";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";

const PracticePage = async () => {
  const user = await getUserFromSession();

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Practice Languages
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Select a language to practice your vocabulary. Regular practice helps
          you memorize words more effectively.
        </p>

        <Suspense fallback={<LanguageListSkeleton />}>
          <LanguageCardsList user={user} />
        </Suspense>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 pt-6 border-t">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Want to learn more languages?
            </h3>
            <p className="text-gray-500 text-sm">
              Explore our vocabulary collections to add more languages to your
              practice.
            </p>
          </div>
          <Link href="/languages">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Languages className="mr-2 h-4 w-4" />
              Explore Languages
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;

const LanguageListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border rounded-lg p-5 h-[200px] animate-pulse"
        >
          <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-6"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-full bg-gray-200 rounded mt-6"></div>
        </div>
      ))}
    </div>
  );
};
