"use client";

import type React from "react";
import type { SortDirection, SortField } from "@/types";

interface TableControlsProps {
  filter: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pageSize: number;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalCount: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
}
const TableControls = ({
  filter,
  onFilterChange,
  pageSize,
  onPageSizeChange,
  totalCount,
  sortField,
  sortDirection,
  onSortChange,
}: TableControlsProps) => {
  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter words..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filter}
            onChange={onFilterChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={pageSize}
            onChange={onPageSizeChange}
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
        <SortButton
          field="word"
          currentField={sortField}
          direction={sortDirection}
          onClick={() => onSortChange("word")}
        />
        <SortButton
          field="type"
          currentField={sortField}
          direction={sortDirection}
          onClick={() => onSortChange("type")}
        />
        <SortButton
          field="difficulty"
          currentField={sortField}
          direction={sortDirection}
          onClick={() => onSortChange("difficulty")}
        />
      </div>
    </>
  );
};

interface SortButtonProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: () => void;
}

function SortButton({
  field,
  currentField,
  direction,
  onClick,
}: SortButtonProps) {
  const isActive = currentField === field;
  const label = field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md ${
        isActive
          ? "bg-purple-100 text-purple-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label} {isActive && (direction === "asc" ? "↑" : "↓")}
    </button>
  );
}

export default TableControls;
