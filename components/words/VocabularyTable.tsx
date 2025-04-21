"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddToVocabularyButton from "./AddToVocabularyButton";

// Generic type for any language word
interface Word {
  id: string;
  word: string;
  example: string | null;
  type: string;
  difficulty: string | null;
  createdAt: Date | null;
  comment: string | null;
  language: string; // Language identifier
}

// Generic type for word pairs
interface WordPair {
  id: string; // Unique ID for the pair
  words: Word[]; // Array of words in different languages
}

interface VocabularyTableProps {
  wordPairs: WordPair[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onAddToVocabulary?: (wordId: string, language: string) => void;
}

export default function VocabularyTable({
  wordPairs,
  totalCount,
  currentPage,
  pageSize,
  onAddToVocabulary,
}: VocabularyTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState(searchParams.get("filter") || "");
  const [sortField, setSortField] = useState<"word" | "type" | "difficulty">(
    (searchParams.get("sort") as "word" | "type" | "difficulty") || "word"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (searchParams.get("dir") as "asc" | "desc") || "asc"
  );
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  // Mock function for adding to vocabulary
  const handleAddToVocabulary = (wordId: string, language: string) => {
    console.log(`Adding ${language} word with ID ${wordId} to vocabulary`);
    if (onAddToVocabulary) {
      onAddToVocabulary(wordId, language);
    }
  };

  const toggleSort = (field: "word" | "type" | "difficulty") => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    // Update URL params
    updateSearchParams({
      sort: field,
      dir: newDirection,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedWord(expandedWord === id ? null : id);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);

    // Debounce filter updates to URL
    const timeoutId = setTimeout(() => {
      updateSearchParams({
        filter: e.target.value,
        page: "1", // Reset to first page on filter change
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const updateSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or add new params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({
      size: e.target.value,
      page: "1", // Reset to first page when changing page size
    });
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "A1":
        return "bg-green-100 text-green-800";
      case "A2":
        return "bg-green-200 text-green-800";
      case "B1":
        return "bg-yellow-100 text-yellow-800";
      case "B2":
        return "bg-yellow-200 text-yellow-800";
      case "C1":
        return "bg-red-100 text-red-800";
      case "C2":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show limited page numbers with ellipsis for large page counts
  const getVisiblePageNumbers = () => {
    if (totalPages <= 7) return pageNumbers;

    if (currentPage <= 4) {
      return [...pageNumbers.slice(0, 5), -1, totalPages];
    } else if (currentPage >= totalPages - 3) {
      return [1, -1, ...pageNumbers.slice(totalPages - 5)];
    } else {
      return [
        1,
        -1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        -1,
        totalPages,
      ];
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter words..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-500">
            entries | {totalCount} total
          </span>
        </div>
      </div>

      {/* Sort controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <button
          onClick={() => toggleSort("word")}
          className={`px-3 py-1 text-sm rounded-md ${
            sortField === "word"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Word {sortField === "word" && (sortDirection === "asc" ? "↑" : "↓")}
        </button>
        <button
          onClick={() => toggleSort("type")}
          className={`px-3 py-1 text-sm rounded-md ${
            sortField === "type"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Type {sortField === "type" && (sortDirection === "asc" ? "↑" : "↓")}
        </button>
        <button
          onClick={() => toggleSort("difficulty")}
          className={`px-3 py-1 text-sm rounded-md ${
            sortField === "difficulty"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Difficulty{" "}
          {sortField === "difficulty" && (sortDirection === "asc" ? "↑" : "↓")}
        </button>
      </div>

      {/* Vocabulary list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wordPairs.map((pair) => (
          <div
            key={pair.id}
            className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(pair.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  {/* Polish word */}
                  <div className="text-lg font-medium text-gray-900">
                    {pair.words.find((w) => w.language === "polish")?.word}
                  </div>
                  {/* Russian word */}
                  <div className="text-md text-gray-500">
                    {pair.words.find((w) => w.language === "russian")?.word}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {/* Word type */}
                  <span className="text-xs text-gray-500 mt-1">
                    {pair.words.find((w) => w.language === "polish")?.type}
                  </span>
                </div>
              </div>

              {/* Add to vocabulary button - only for Polish words */}
              <div className="mt-3">
                <AddToVocabularyButton
                  wordId={
                    pair.words.find((w) => w.language === "polish")?.id || ""
                  }
                  language="polish"
                  label="Add to my vocabulary"
                />
              </div>

              {/* Expand/collapse indicator */}
              <div className="text-center mt-2 text-gray-400">
                {expandedWord === pair.id ? "▲ Less details" : "▼ More details"}
              </div>
            </div>

            {/* Expanded details */}
            {expandedWord === pair.id && (
              <div className="p-4 border-t bg-gray-50">
                <div className="grid grid-cols-1 gap-4">
                  {pair.words.map((word) => (
                    <div
                      key={word.id}
                      className="space-y-2"
                    >
                      <h4 className="font-medium text-gray-900 capitalize">
                        {word.language}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Type:</div>
                        <div>{word.type}</div>
                      </div>

                      {word.example && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-500">
                            Example:
                          </span>
                          <p className="text-sm text-gray-700 italic mt-1 p-2 bg-white rounded border">
                            {word.example}
                          </p>
                        </div>
                      )}

                      {word.comment && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-500">
                            Comment:
                          </span>
                          <p className="text-sm text-gray-700 mt-1 p-2 bg-white rounded border">
                            {word.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {wordPairs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">
            No words found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>

        <div className="flex items-center space-x-1 order-1 sm:order-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Previous
          </button>

          {getVisiblePageNumbers().map((pageNum, index) =>
            pageNum === -1 ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNum
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
