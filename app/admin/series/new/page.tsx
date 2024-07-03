"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PostStatus, Status, Type } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateSerie } from "@/services/series/mutations";

import { Form, FormField } from "@/components/ui/form";
import FormInput from "@/components/admin/forms/FormInput";
import FormSelect from "@/components/admin/forms/FormSelect";
import FormTextarea from "@/components/admin/forms/FormTextarea";
import AdminCard from "@/components/admin/AdminCard";
import FormAction from "@/components/admin/forms/FormAction";
import FormActionMobile from "@/components/admin/forms/FormActionMobile";
import FormUpload from "@/components/admin/forms/FormUpload";

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
});

const NewSeriesPage = () => {
  const router = useRouter();
  const createSerie = useCreateSerie();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      postStatus: PostStatus.PUBLISHED,
      status: Status.ONGOING,
      type: Type.MANGA,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    createSerie.mutate(
      { json: data },
      {
        onSuccess: () => {
          toast.success("Series created");
          router.push("/admin/series");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormAction title="New Series"/>
          
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

              {/* <Card>
                <CardHeader>
                  <CardTitle>Series Genre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Label>Genre</Label>
                    <Input type="text" placeholder="genre" />
                  </div>
                </CardContent>
              </Card> */}
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
    </main>
  );
};

export default NewSeriesPage;
