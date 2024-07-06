"use client";

import api from "@/lib/api";
import { InferResponseType } from "hono";
import { useState } from "react";
import AdminCard from "../AdminCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import AdminPagination from "../AdminPagination";
import AdminAlertDialog from "../AdminAlertDialog";
import { useDeleteSerie } from "@/services/series/mutations";
import { toast } from "sonner";

const SeriesTable = ({
  data,
  isLoading,
}: {
  data?: InferResponseType<typeof api.series.$get>;
  isLoading: boolean;
}) => {
  const [dialog, setDialog] = useState({
    open: false,
    value: {
      id: 0,
      title: "",
    },
  });
  const deleteSeries = useDeleteSerie()

  if (isLoading) return <div>Loading...</div>;

  if (data?.data && data?.data?.length < 1) {
    return <div>Not Found</div>;
  }

  const handleDelete = (id: number) => {
    deleteSeries.mutate({
        param: { id: id.toString() }
    }, {
        onSuccess: () => {
            toast.success("Series deleted successfuly")
            setDialog({ open: false, value: { id: 0, title: ""} })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
  }

  return (
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
          {isLoading ? (
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
                  {formatDate(series.createdAt)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(series.updatedAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
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
                            value: {
                              id: series.id,
                              title: series.title,
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
          You have total of <strong>{data?.counts}</strong> series
        </div>
        <AdminPagination hasNext={data?.hasNext || false} />
      </div>

      <AdminAlertDialog
          open={dialog.open}
          title="Are you absolutely sure?"
          onSubmit={() => handleDelete(dialog.value.id)}
          onOpenChange={() => setDialog({ ...dialog, open: !open })}
        >
          This action cannot be undone. This will permanently delete{" "}
          <strong>{dialog.value.title}</strong> and remove the data from our servers.
        </AdminAlertDialog>
    </AdminCard>
  );
};

export default SeriesTable;
