"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";
import AdminCard from "../AdminCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminPagination from "../AdminPagination";
import AdminAlertDialog from "../AdminAlertDialog";
import { useGetChapters } from "@/services/chapters/queries";
import { useDeleteChapter } from "@/services/chapters/mutations";

const ChaptersTable = () => {
  const searchParams = useSearchParams();
  const [currentStatus, setCurrentStatus] = useState(searchParams.get("status") || "all");
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || "1");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    value: {
        id: 0,
        title: ""
    }
  })

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

  const { data, isPending } = useGetChapters({
    limit: 10,
    page: Number(currentPage),
    postStatus: currentStatus === "all" ? undefined : currentStatus.toUpperCase() as any
  })
  const deleteChapter = useDeleteChapter()

  const handleDelete = (id: number) => {
    deleteChapter.mutate({
      param: { id: id.toString() }
    }, {
      onSuccess: () => {
        toast.success("Chapter deleted successfully")
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <>
      <Tabs defaultValue={currentStatus}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" asChild>
              <Link href={"/admin/chapters?status=all"}>All</Link>
            </TabsTrigger>
            <TabsTrigger value="published" asChild>
              <Link href={"/admin/chapters?status=published"}>Published</Link>
            </TabsTrigger>
            <TabsTrigger value="draft" asChild>
              <Link href={"/admin/chapters?status=draft"}>Draft</Link>
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/chapters/new">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Chapter
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Tabs>

      <AdminCard
        title="Chapters"
        description="Manage your chapters and view their audience performance."
      >
        <Table>
          <TableHeader>
            <TableRow>
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
            {isPending ? (
              <TableRow>
                <TableCell align="center" colSpan={100}>
                  Please Wait
                </TableCell>
              </TableRow>
            ) : data && data?.data?.length > 0 ? (
              data?.data?.map((chapters) => (
                <TableRow key={chapters.id}>
                  <TableCell className="font-medium">{chapters.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{chapters.postStatus}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {chapters.user.username}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(chapters.createdAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(chapters.updatedAt)}
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
                          <Link href={`/admin/chapters/edit/${chapters.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              value: {
                                id: chapters.id,
                                title: chapters.title,
                              },
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

        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-muted-foreground">
            You have total of <strong>{data?.counts}</strong> chapters
          </div>
          <AdminPagination hasNext={data?.hasNext || false} />
        </div>

        <AdminAlertDialog
          open={deleteDialog.open}
          title="Are you absolutely sure?"
          onSubmit={() => handleDelete(deleteDialog.value.id)}
          onOpenChange={() => setDeleteDialog({ open: !open, value: { id: 0, title: "" } })}
        >
          This action cannot be undone. This will permanently delete{" "}
          <strong>{deleteDialog.value.title}</strong> and remove the data from our
          servers.
        </AdminAlertDialog>
      </AdminCard>
    </>
  );
};

export default ChaptersTable;
