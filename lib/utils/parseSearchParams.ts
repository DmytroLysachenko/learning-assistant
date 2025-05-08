import { WordType } from "@/types";

type ParsedSearchParams = Promise<{
  currentPage: number;
  pageSize: number;
  filter: string;
  wordType: WordType;
  sortField: string;
  sortDirection: "asc" | "desc";
  offset: number;
}>;

type SearchParams = Promise<{
  page?: string;
  size?: string;
  filter?: string;
  wordType?: string;
  sort?: string;
  dir?: string;
}>;

export const parseSearchParams = async (
  searchParams: SearchParams
): ParsedSearchParams => {
  const {
    page,
    size,
    filter: filterParam,
    sort,
    dir,
    wordType: wordTypeParam,
  } = await searchParams;

  const currentPage = Number.parseInt(page || "1", 10);
  const pageSize = Number.parseInt(size || "10", 10);
  const filter = filterParam?.trim() || "";

  const sortField = sort || "word";
  const sortDirection = dir === "desc" ? "desc" : "asc";
  const offset = (currentPage - 1) * pageSize;

  const wordType = wordTypeParam as WordType;

  return {
    currentPage,
    pageSize,
    filter,
    wordType,
    sortField,
    sortDirection,
    offset,
  };
};
