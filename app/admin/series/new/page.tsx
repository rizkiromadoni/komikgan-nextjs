"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ChevronLeft, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const NewSeriesPage = () => {
  const router = useRouter();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
            <Button size="sm">Save Product</Button>
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
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Title</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      defaultValue="Gamer Gear Pro Controller"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                      className="min-h-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Series Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Alternative</Label>
                    <Input type="text" placeholder="alternative" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Author</Label>
                    <Input type="text" placeholder="author" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Artist</Label>
                    <Input type="text" placeholder="artist" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Serialization</Label>
                    <Input type="text" placeholder="serialization" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Released</Label>
                    <Input type="text" placeholder="2024" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Rating</Label>
                    <Input type="text" placeholder="8.21" />
                  </div>
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
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Select defaultValue="published">
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Series Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="ongoing">
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="status">Type</Label>
                    <Select defaultValue="manga">
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manga">Manga</SelectItem>
                        <SelectItem value="manhwa">Manhwa</SelectItem>
                        <SelectItem value="manhua">Manhua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Series Cover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Image
                    alt="Product image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src="/no-avatar.jpg"
                    width="300"
                  />
                  <button className="flex aspect-square w-full h-16 items-center justify-center rounded-md border border-dashed gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span>Upload</span>
                  </button>
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
      </div>
    </main>
  );
};

export default NewSeriesPage;
