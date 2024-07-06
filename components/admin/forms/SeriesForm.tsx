"use client";

import { z } from "zod";
import { PostStatus, Status, Type } from "@prisma/client";

import AdminCard from "@/components/admin/AdminCard";
import { Form, FormField } from "@/components/ui/form";
import FormInput from "@/components/admin/forms/FormInput";
import FormSelect from "@/components/admin/forms/FormSelect";
import FormAction from "@/components/admin/forms/FormAction";
import FormUpload from "@/components/admin/forms/FormUpload";
import FormTextarea from "@/components/admin/forms/FormTextarea";
import FormActionMobile from "@/components/admin/forms/FormActionMobile";
import { InferResponseType } from "hono";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSerie, useUpdateSerie } from "@/services/series/mutations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, { message: "Series title is required" }).max(225),
  description: z.string().min(1, { message: "Series description is required" }),
  image: z.any().optional(),
  postStatus: z.nativeEnum(PostStatus),
  status: z.nativeEnum(Status),
  type: z.nativeEnum(Type),
  alternative: z.string().max(225).optional(),
  author: z.string().max(225).optional(),
  artist: z.string().max(225).optional(),
  serialization: z.string().max(225).optional(),
  released: z.string().max(225).optional(),
  rating: z.string().max(225).optional(),
  genres: z.string().optional()
});

const SeriesForm = ({ data }: { data?: InferResponseType<typeof api.series.get.$get> }) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      image: data?.image ?? undefined,
      postStatus: data?.postStatus ?? PostStatus.PUBLISHED,
      status: data?.status ?? Status.ONGOING,
      type: data?.type ?? Type.MANGA,
      alternative: data?.alternative ?? "",
      author: data?.author ?? "",
      artist: data?.artist ?? "",
      serialization: data?.serialization ?? "",
      released: data?.released ?? "",
      rating: data?.rating ?? "",
      genres: (data?.genres && data?.genres?.length > 0) ? data?.genres.map(item => item.name).join(",") : ""
    },
  });
  const createSerie = useCreateSerie()
  const updateSerie = useUpdateSerie()

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!data) {
      createSerie.mutate({
        json: {
          ...values,
          genres: values.genres ? values.genres.split(",") : undefined
        }
      }, {
        onSuccess: () => {
          toast.success("Series created successfully.")
          router.push("/admin/series")
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } else {
      updateSerie.mutate({
        param: { id: data.id.toString() },
        json: {
          ...values,
          genres: values.genres ? values.genres.split(",") : undefined
        }
      }, {
        onSuccess: () => {
          toast.success("Series updated successfully.")
          router.push("/admin/series")
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    }
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormAction title="New Series" />

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <AdminCard title="Series Information">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Title"
                      placeholder="Boruto: Naruto Next Generations"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormTextarea
                      field={field}
                      label="Description"
                      placeholder="lorem"
                      className="min-h-32"
                    />
                  )}
                />
              </div>
            </AdminCard>

            <AdminCard title="Series Details">
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="alternative"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Alternative"
                      placeholder="alternative"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Author"
                      placeholder="author"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Artist"
                      placeholder="artist"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="serialization"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Serialization"
                      placeholder="serialization"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="released"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Released"
                      placeholder="2024"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Rating"
                      placeholder="8.24"
                    />
                  )}
                />
              </div>
            </AdminCard>

            <AdminCard title="Series Genre">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="genres"
                  render={({ field }) => (
                    <FormTextarea
                      field={field}
                      label="Genres"
                      placeholder="Adventure,Comedy,Horror"
                      className="min-h-32"
                    />
                  )}
                />
              </div>
            </AdminCard>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <AdminCard title="Save As">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="postStatus"
                  render={({ field }) => (
                    <FormSelect
                      field={field}
                      placeholder="Select Status"
                      items={[
                        { label: "Draft", value: "DRAFT" },
                        { label: "Publish", value: "PUBLISHED" },
                      ]}
                    />
                  )}
                />
              </div>
            </AdminCard>

            <AdminCard title="Series Type">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormSelect
                      field={field}
                      label="Status"
                      placeholder="Select Status"
                      items={[
                        { label: "Ongoing", value: "ONGOING" },
                        { label: "Completed", value: "COMPLETED" },
                      ]}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormSelect
                      field={field}
                      label="Type"
                      placeholder="Select Type"
                      items={[
                        { label: "Manga", value: "MANGA" },
                        { label: "Manhwa", value: "MANHWA" },
                        { label: "Manhua", value: "MANHUA" },
                      ]}
                    />
                  )}
                />
              </div>
            </AdminCard>

            <AdminCard title="Series Cover">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormUpload value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </AdminCard>
          </div>
        </div>

        <FormActionMobile />
      </form>
    </Form>
  );
};

export default SeriesForm;
