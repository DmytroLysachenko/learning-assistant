"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const useUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (params: Record<string, string>) => {
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
    },
    [router, searchParams]
  );

  const getParam = useCallback(
    (key: string, defaultValue = "") => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  return {
    updateSearchParams,
    getParam,
  };
};

export default useUrlParams;
