"use client";

import type React from "react";

import { useState, useCallback } from "react";
import type { WordPair, SortField, SortDirection } from "@/types";

import TableControls from "./TableControls";
import Pagination from "./Pagination";
import useUrlParams from "@/lib/hooks/useUrlParams";
import EmptyState from "./EmpryState";
import WordPairCard from "./WordPairCard";

interface VocabularyTableProps {
  wordPairs: WordPair[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  userId: string;
  isUserVocabulary?: boolean;
}

const VocabularyTable = ({
  wordPairs,
  totalCount,
  currentPage,
  pageSize,
  userId,
  isUserVocabulary,
}: VocabularyTableProps) => {
  const { updateSearchParams, getParam } = useUrlParams();

  const [filter, setFilter] = useState(getParam("filter", ""));
  const [sortField, setSortField] = useState<SortField>(
    getParam("sort", "word") as SortField
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    getParam("dir", "asc") as SortDirection
  );
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  const handleToggleSort = useCallback(
    (field: SortField) => {
      const newDirection =
        sortField === field && sortDirection === "asc" ? "desc" : "asc";
      setSortField(field);
      setSortDirection(newDirection);

      // Update URL params
      updateSearchParams({
        sort: field,
        dir: newDirection,
      });
    },
    [sortField, sortDirection, updateSearchParams]
  );

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedWord((prev) => (prev === id ? null : id));
  }, []);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);

      // Debounce filter updates to URL
      const timeoutId = setTimeout(() => {
        updateSearchParams({
          filter: e.target.value,
          page: "1", // Reset to first page on filter change
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [updateSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
    },
    [updateSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateSearchParams({
        size: e.target.value,
        page: "1", // Reset to first page when changing page size
      });
    },
    [updateSearchParams]
  );

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="w-full">
      <TableControls
        filter={filter}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalCount={totalCount}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleToggleSort}
      />

      {/* Vocabulary list */}
      {wordPairs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordPairs.map((pair) => (
            <WordPairCard
              key={pair.id}
              pair={pair}
              userId={userId}
              expandedId={expandedWord}
              onToggleExpand={handleToggleExpand}
              isUserVocabulary={isUserVocabulary}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default VocabularyTable;
