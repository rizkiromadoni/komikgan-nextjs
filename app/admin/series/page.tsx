"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSeries } from "@/services/series/queries";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SeriesTable from "@/components/admin/tables/SeriesTable";

const AdminSeriesPage = () => {
  const searchParams = useSearchParams();
  const [currentStatus, setCurrentStatus] = useState(searchParams.get("status") || "all");
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || "1");

  useEffect(() => {
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    
    if (status && status !== currentStatus) {
      setCurrentStatus(status);
    }
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams, currentPage, currentStatus]);

  const { data, isLoading } = useGetSeries({
    limit: 10,
    page: Number(currentPage),
    postStatus: currentStatus === "all" ? undefined : currentStatus.toUpperCase() as any,
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue={currentStatus}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" asChild>
              <Link href={"/admin/series?status=all"}>All</Link>
            </TabsTrigger>
            <TabsTrigger value="published" asChild>
              <Link href={"/admin/series?status=published"}>Published</Link>
            </TabsTrigger>
            <TabsTrigger value="draft" asChild>
              <Link href={"/admin/series?status=draft"}>Draft</Link>
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/series/new">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Series
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Tabs>

      <SeriesTable data={data} isLoading={isLoading} />
    </main>
  );
};

export default AdminSeriesPage;
