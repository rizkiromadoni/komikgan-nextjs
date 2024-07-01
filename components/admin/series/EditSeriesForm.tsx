"use client";

import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostStatus, Status, Type } from "@prisma/client";
import { InferResponseType } from "hono";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import CoverUpload from "@/components/CoverUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditSerie } from "@/services/series/mutations";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, { message: "Series title is required" }).max(225),
  description: z.string().min(1, { message: "Series description is required" }),
  image: z.string().optional(),
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

const EditSeriesForm = ({
  data,
}: {
  data: InferResponseType<typeof api.series.get.$get>;
}) => {
  const router = useRouter();
  const editSerie = useEditSerie();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title,
      description: data?.description,
      postStatus: data?.postStatus,
      status: data?.status,
      type: data?.type,
      image: data?.image ?? undefined,
      alternative: data?.alternative ?? undefined,
      author: data?.author ?? undefined,
      artist: data?.artist ?? undefined,
      serialization: data?.serialization ?? undefined,
      released: data?.released ?? undefined,
      rating: data?.rating ?? undefined,
    },
  });

  if (!data) return null;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    editSerie.mutate({
      param: { id: data.id.toString() },
      json: values
    }, {
      onSuccess: () => {
        toast.success("Series updated")
        router.push("/admin/series")
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            New Series
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Discard
            </Button>
            <Button size="sm" type="submit">
              Save Product
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Series Information</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Boruto: Naruto Next Generations"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Series Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="alternative"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternative</FormLabel>
                        <FormControl>
                          <Input placeholder="alternative" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="author" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist</FormLabel>
                        <FormControl>
                          <Input placeholder="artist" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serialization</FormLabel>
                        <FormControl>
                          <Input placeholder="serialization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="released"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Released</FormLabel>
                        <FormControl>
                          <Input placeholder="released" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <Input placeholder="8.24" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Series Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Label>Genre</Label>
                  <Input type="text" placeholder="genre" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Save As</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="postStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PUBLISHED">
                                Published
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Series Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ONGOING">Ongoing</SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MANGA">Manga</SelectItem>
                              <SelectItem value="MANHWA">Manhwa</SelectItem>
                              <SelectItem value="MANHUA">Manhua</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Series Cover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CoverUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Product</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditSeriesForm;
