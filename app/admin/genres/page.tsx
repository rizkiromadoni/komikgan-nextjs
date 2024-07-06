"use client";

import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useGetGenres } from "@/services/genres/queries";
import { useCreateGenre } from "@/services/genres/mutations";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AdminCard from "@/components/admin/AdminCard";
import GenreForm from "@/components/admin/forms/GenreForm";
import GenreTable from "@/components/admin/tables/GenreTable";
import AdminPagination from "@/components/admin/AdminPagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GenresPage = () => {
  const params = useSearchParams();
  const [currentPage, setCurrentPage] = useState(params.get("page") || "1");
  const [newGenreOpen, setNewGenreOpen] = useState(false);

  useEffect(() => {
    const page = params.get("page");
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [params, currentPage]);

  const createGenre = useCreateGenre();
  const { data, isLoading } = useGetGenres({
    page: currentPage,
    limit: "10",
    sortBy: "updatedAt",
    sort: "desc",
  });

  const handleSubmit = async (name: string) => {
    createGenre.mutate(
      {
        json: { name },
      },
      {
        onSuccess: () => {
          toast.success("Genre created successfully.");
          setNewGenreOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" className="cursor-default">
              All
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1"
              onClick={() => setNewGenreOpen(true)}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Genre
              </span>
            </Button>
          </div>
        </div>
      </Tabs>

      <GenreTable data={data} isLoading={isLoading} />

      <GenreForm
        open={newGenreOpen}
        onSumbit={(_, data) => handleSubmit(data.name)}
        onClose={() => setNewGenreOpen(false)}
      />
    </main>
  );
};

export default GenresPage;
