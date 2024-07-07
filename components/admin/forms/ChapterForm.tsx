"use client";

import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormAction from "./FormAction";
import FormActionMobile from "./FormActionMobile";
import AdminCard from "../AdminCard";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import FormInput from "./FormInput";
import SeriesCombobox from "./SeriesCombobox";
import { useCreateChapter, useUpdateChapter } from "@/services/chapters/mutations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import api from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, { message: "Chapter title is required" }).max(225),
  content: z.string().min(1, { message: "Chapter content is required" }),
  postStatus: z.nativeEnum(PostStatus),
  chapterNumber: z.string().min(1, { message: "Chapter number is required" }),
  seriesId: z.number().min(1, { message: "Series is required" }),
});

const ChapterForm = ({
  data,
}: {
  data?: InferResponseType<typeof api.chapters.get.$get>;
}) => {
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      content: data?.content || "",
      postStatus: data?.postStatus || PostStatus.PUBLISHED,
      chapterNumber: data?.chapterNumber || "",
      seriesId: data?.serieId || 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (data?.id) {
      updateChapter.mutate(
        {
          param: { id: data.id.toString() },
          json: values,
        },
        {
          onSuccess: () => {
            toast.success("Chapter updated successfully.");
            router.push("/admin/chapters");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } else {
      createChapter.mutate(
        {
          json: values,
        },
        {
          onSuccess: () => {
            toast.success("Chapter created successfully.");
            router.push("/admin/chapters");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormAction title={data ? "Edit Chapter" : "New Chapter"} />

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <AdminCard title="Chapter Information">
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
                  name="content"
                  render={({ field }) => (
                    <FormTextarea
                      field={field}
                      label="Content"
                      placeholder="lists of image url, seperate with new line"
                      className="min-h-64"
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

            <AdminCard title="Chapter Details">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="seriesId"
                  render={({ field }) => (
                    <SeriesCombobox
                      field={field}
                      defaultValue={data ? data.serie.title : undefined}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="chapterNumber"
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      label="Chapter Number"
                      placeholder="8"
                    />
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

export default ChapterForm;
