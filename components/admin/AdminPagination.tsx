"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

const AdminPagination = ({
  hasNext,
}: {
  hasNext: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || "1");

  useEffect(() => {
    const page = searchParams.get("page");
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams, currentPage])

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="flex w-auto mx-0">
      <PaginationContent>
        {Number(currentPage) > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(Number(currentPage) - 1)} />
          </PaginationItem>
        )}
        {hasNext && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(Number(currentPage) + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default AdminPagination;
