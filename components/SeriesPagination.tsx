"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SeriesPagination = ({ hasNext }: { hasNext: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") || "1"
  );

  useEffect(() => {
    const page = searchParams.get("page");
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams, currentPage]);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex mx-auto gap-2">
      {Number(currentPage) > 1 && (
        <Link
          href={createPageUrl(Number(currentPage) - 1)}
          className="flex gap-2 items-center justify-center bg-[#3b3c4c] text-[#9ca9b9] hover:bg-[#6e6dfb] hover:text-white px-4 py-2 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Link>
      )}
      {hasNext && (
        <Link
          href={createPageUrl(Number(currentPage) + 1)}
          className="flex gap-2 items-center justify-center bg-[#3b3c4c] text-[#9ca9b9] hover:bg-[#6e6dfb] hover:text-white px-4 py-2 rounded-md"
        >
          <ArrowRight className="w-4 h-4" />
          Next
        </Link>
      )}
    </div>
  );
};

export default SeriesPagination;
