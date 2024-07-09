"use client";

import { useGetSeries } from "@/services/series/queries";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SeriesList from "./SeriesList";

const LatestUpdate = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const { data, isPending } = useGetSeries({
    limit: 10,
    page: currentPage,
    sortBy: "updatedAt",
    sort: "desc",
  });
  
  return (
    <div className="m-2">
      <div className="flex justify-between">
        <h2 className="w-full py-4 text-2xl font-semibold text-left">
          <span className="text-[#3453d1]">Latest</span> Update
        </h2>
      </div>
      {isPending ? (
        <div className="w-full flex justify-center items-center">
            Please wait...
        </div>
      ): <SeriesList data={data} />}
    </div>
  );
};

export default LatestUpdate;
