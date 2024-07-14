"use client";

import { useGetSingleGenre } from "@/services/genres/queries";
import { useGetSeries } from "@/services/series/queries";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SeriesList from "./SeriesList";
import SeriesPagination from "./SeriesPagination";

const SeriesByGenre = ({ slug }: { slug: string }) => {
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

  const { data: genre, isPending: genrePending } = useGetSingleGenre({ slug });
  const { data: series, isPending: seriesPending } = useGetSeries({
    limit: 10,
    page: currentPage,
    genre: slug,
  });

  if (!genrePending && !genre) {
    return notFound()
  }

  return (
    <div className="flex flex-col">
      <h2 className="w-full py-4 text-2xl font-semibold text-left">
        <span className="text-[#3453d1]">Genre</span> {genre?.name}
      </h2>
      {seriesPending ? (
        <div className="w-full flex justify-center items-center">
          Please wait...
        </div>
      ) : series ? (
        <div className="flex flex-col gap-4">
          <SeriesList data={series} />
          <SeriesPagination hasNext={series.hasNext} />
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          There is no series in this genre
        </div>
      )}
    </div>
  );
};

export default SeriesByGenre;
