"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSeries } from "@/services/series/queries";
import { useEffect, useState } from "react";
import { useDeleteSerie } from "@/services/series/mutations";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminAlertDialog from "@/components/admin/AdminAlertDialog";
import AdminCard from "@/components/admin/AdminCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminSeriesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const status: any = params.get("status");
  const page: any = params.get("page") ? Number(params.get("page")) : 1;

  const { data, isLoading, refetch, isRefetching } = useGetSeries({
    limit: 10,
    page,
    postStatus: status === null ? undefined : status.toUpperCase(),
  });
  const [dialog, setDialog] = useState<{
    open: boolean;
    value: number;
    title: string;
  }>({
    open: false,
    value: 0,
    title: "",
  });
  const deleteSerie = useDeleteSerie();

  useEffect(() => {
    refetch();
  }, [status, page, refetch]);

  const handleDelete = (id: number) => {
    deleteSerie.mutate(
      { param: { id: id.toString() } },
      {
        onSuccess: () => {
          toast.success("Series successfully deleted.");
          refetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setDialog({ ...dialog, open: false });
        },
      }
    );
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {/* <Tabs
        defaultValue={status}
        onValueChange={(e) =>
          e === "ALL"
            ? router.push("/admin/series")
            : router.push(`${pathname}?status=${e}`)
        }
      > */}
      <Tabs defaultValue={status === null ? "all" : status}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" asChild>
              <Link href={"/admin/series"}>All</Link>
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
                  Add Product
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Tabs>

      <AdminCard
        title="Series"
        description="Manage your series and view their audience performance."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Publisher</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Updated at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isRefetching ? (
              <TableRow>
                <TableCell align="center" colSpan={100}>
                  Please Wait
                </TableCell>
              </TableRow>
            ) : data && data?.data?.length > 0 ? (
              data?.data?.map((series) => (
                <TableRow key={series.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={series.slug}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={series.image || "/no-avatar.jpg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{series.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{series.postStatus}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {series.user.username}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(series.createdAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(series.updatedAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/admin/series/edit/${series.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            setDialog({
                              open: true,
                              value: series.id,
                              title: series.title,
                            })
                          }
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={10}>
                  Not Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination className="flex justify-between items-center mt-4">
          <div className="text-xs text-muted-foreground">
            You have total of <strong>{data?.counts}</strong> series
          </div>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`${pathname}?${
                    status !== null ? `status=${status}&` : ""
                  }page=${page - 1}`}
                />
              </PaginationItem>
            )}
            {data?.hasNext && (
              <PaginationItem>
                <PaginationNext
                  href={`${pathname}?${
                    status !== null ? `status=${status}&` : ""
                  }page=${page + 1}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </AdminCard>

      <AdminAlertDialog
        open={dialog.open}
        title="Are you absolutely sure?"
        onSubmit={() => handleDelete(dialog.value)}
        onOpenChange={() => setDialog({ ...dialog, open: !open })}
      >
        This action cannot be undone. This will permanently delete{" "}
        <strong>{dialog.title}</strong> and remove the data from our servers.
      </AdminAlertDialog>
    </main>
  );
};

export default AdminSeriesPage;
