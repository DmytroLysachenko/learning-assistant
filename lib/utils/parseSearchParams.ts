type ParsedSearchParams = Promise<{
  currentPage: number;
  pageSize: number;
  filter: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  offset: number;
}>;

export const parseSearchParams = async (
  searchParams: Promise<{
    page?: string;
    size?: string;
    filter?: string;
    sort?: string;
    dir?: string;
  }>
): ParsedSearchParams => {
  const { page, size, filter: filterParam, sort, dir } = await searchParams;

  const currentPage = Number.parseInt(page || "1", 10);
  const pageSize = Number.parseInt(size || "10", 10);
  const filter = filterParam?.trim() || "";

  const sortField = sort || "word";
  const sortDirection = dir === "desc" ? "desc" : "asc";
  const offset = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    filter,
    sortField,
    sortDirection,
    offset,
  };
};
