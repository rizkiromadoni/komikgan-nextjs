"use client";

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
import api from "@/lib/api";
import { InferResponseType } from "hono";
import { MoreHorizontal } from "lucide-react";
import AdminAlertDialog from "../AdminAlertDialog";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import GenreForm from "../forms/GenreForm";
import { useDeleteGenre, useUpdateGenre } from "@/services/genres/mutations";
import { toast } from "sonner";
import AdminCard from "../AdminCard";
import AdminPagination from "../AdminPagination";

const GenreTable = ({
  data,
  isLoading,
}: {
  data?: InferResponseType<typeof api.genres.$get>;
  isLoading: boolean;
}) => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    value: number;
    title: string;
  }>({
    open: false,
    value: 0,
    title: "",
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    value: {
      id: 0,
      name: "",
    },
  });

  const updateGenre = useUpdateGenre();
  const deleteGenre = useDeleteGenre();

  const handleEdit = (id: number | null, data: { name: string }) => {
    if (!id || id === 0) return;

    updateGenre.mutate(
      {
        param: { id: id.toString() },
        json: { name: data.name },
      },
      {
        onSuccess: () => {
          toast.success("Genre updated successfully.");
          setEditDialog({ open: false, value: { id: 0, name: "" } });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteGenre.mutate(
      {
        param: { id: id.toString() },
      },
      {
        onSuccess: () => {
          toast.success("Genre deleted successfully.");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;

  if (data?.data && data?.data?.length < 1) {
    return <div>Not Found</div>;
  }

  return (
    <AdminCard title="Genres" description="Manage and view your genre list">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Slug</TableHead>
            <TableHead>Total Series</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="hidden md:table-cell">Updated at</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data && data.data.length !== 0 ? (
            data?.data.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium">{genre.name}</TableCell>
                <TableCell className="hidden sm:table-cell font-medium">
                  {genre.slug}
                </TableCell>
                <TableCell className="font-medium">
                  {genre._count.series}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(genre.createdAt)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(genre.updatedAt)}
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
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setEditDialog({
                            open: true,
                            value: { id: genre.id, name: genre.name },
                          })
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setDialog({
                            open: true,
                            value: genre.id,
                            title: genre.name,
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

        <AdminAlertDialog
          open={dialog.open}
          title="Are you absolutely sure?"
          onSubmit={() => handleDelete(dialog.value)}
          onOpenChange={() => setDialog({ ...dialog, open: !open })}
        >
          This action cannot be undone. This will permanently delete{" "}
          <strong>{dialog.title}</strong> and remove the data from our servers.
        </AdminAlertDialog>

        <GenreForm
          open={editDialog.open}
          onClose={() =>
            setEditDialog({ open: false, value: { id: 0, name: "" } })
          }
          value={editDialog.value}
          onSumbit={handleEdit}
        />
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-muted-foreground">
          You have total of <strong>{data?.counts}</strong> genres
        </div>
        <AdminPagination
          hasNext={data?.hasNext || false}
        />
      </div>
    </AdminCard>
  );
};

export default GenreTable;
