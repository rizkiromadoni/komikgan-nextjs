;"use client"

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SeriesList from "./SeriesList";
import SeriesPagination from "./SeriesPagination";

async function getSearchSeries(query: string) {
    const res = await api.series.$get({
        query: {
            search: decodeURI(query),
        }
    })
    if (!res.ok) {
        throw new Error("Failed to fetch series")
    }
    return await res.json()
}

const SearchSeries = ({ query }: { query: string }) => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  useEffect(() => {
    const page = searchParams.get("page");
    if (page && Number(page) !== currentPage) {
      setCurrentPage(Number(page));
    }
  }, [searchParams, currentPage]);

  const { data, isPending, error } = useQuery({
    queryKey: ["series", { search: query }],
    queryFn: async () => {
        return await getSearchSeries(query)
    },
    retry: false
  })

  return (
    <div className="flex flex-col">
      <h2 className="w-full py-4 text-2xl font-semibold text-left">
        <span className="text-[#3453d1]">Search</span> {decodeURI(query)}
      </h2>
      {isPending ? (
        <div className="w-full flex justify-center items-center">
          Please wait...
        </div>
      ) : data ? (
        <div className="flex flex-col gap-4">
          <SeriesList data={data} />
          <SeriesPagination hasNext={data.hasNext} />
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          There is no series that match query
        </div>
      )}
    </div>
  );
};

export default SearchSeries;
