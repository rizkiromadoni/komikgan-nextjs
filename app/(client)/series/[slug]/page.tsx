"use client";

import { DiscussionEmbed } from 'disqus-react';
import { Button } from "@/components/ui/button";
import { useGetSingleSeries } from "@/services/series/queries";
import { BookOpen, Heart, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

const SingleSeriesPage = ({ params }: { params: { slug: string } }) => {
  const { data, isPending } = useGetSingleSeries({ slug: params.slug });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return notFound()
  }

  return (
    <main className="min-h-[68vh] mb-10">
      <div className="w-full h-72 relative overflow-hidden">
        <Image
          src={data?.image || ""}
          className="blur-lg object-cover brightness-50"
          alt=""
          fill
        />
      </div>
      <div className="relative max-w-5xl mx-auto flex gap-4 flex-col md:flex-row px-4 -mt-48 md:-mt-20">
        <div className="flex flex-col justify-center items-center md:justify-start md:items-start gap-4 min-w-[250px]">
          <Image
            src={data?.image || ""}
            alt=""
            width={250}
            height={344}
            className="rounded-lg w-[250px] h-[344px] shadow-md"
          />
          <h1 className="text-2xl font-bold text-center md:hidden">
            {data?.title}
          </h1>
          <div className="flex flex-col gap-2 w-full">
            <div className="grid grid-cols-2 bg-slate-200 rounded-full overflow-hidden text-sm">
              <div className="flex items-center justify-center font-semibold bg-[#ff5a5a] py-3">
                {data?.type}
              </div>
              <div className="flex items-center justify-center font-semibold bg-[#6cc174] py-3">
                {data?.status}
              </div>
            </div>
            <div className="bg-[#38394a] text-[#9ca9b9] rounded-full flex items-center justify-center py-2 font-semibold text-md gap-2">
              <Star fill="#ffdd73" color="#ffdd73" size={18} />
              {data?.rating}
            </div>
            <Button className="bg-[#c15656] rounded-full flex items-center justify-center py-2 font-semibold text-md gap-2 hover:bg-[#ff5a5a]">
              <Heart fill="#ffffff" color="#ffffff" size={18} />
              Bookmark
            </Button>
            <div className="flex justify-center text-[#9ca9b9] text-sm">
              <p>0 Users Bookmarked</p>
            </div>
            <ul className="bg-[#3b3c4c] text-[#9ca9b9] p-5 rounded-md flex flex-col gap-2">
              <li className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Alternative</p>
                <p className="text-xs">{data?.alternative}</p>
              </li>
              <li className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Published</p>
                <p className="text-xs">{data?.released}</p>
              </li>
              <li className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Author</p>
                <p className="text-xs">{data?.author}</p>
              </li>
              <li className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Artist</p>
                <p className="text-xs">{data?.artist}</p>
              </li>
              <li className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Total Chapters</p>
                <p className="text-xs">? Chapter</p>
              </li>
              <li className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Serialization</p>
                <p className="text-xs">{data?.serialization}</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="md:mt-8">
          <h1 className="hidden md:block text-2xl font-semibold mb-6">
            {data?.title}
          </h1>
          <div className="flex flex-wrap gap-2 py-3">
            {data?.genres &&
              data?.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genres/${genre.slug}`}
                  className="py-2 px-4 bg-[#3b3c4c] rounded-md hover:bg-[#6e6dfb] transition"
                >
                  {genre.name}
                </Link>
              ))}
          </div>
          <p className="text-[#9ca9b9]">{data?.description}</p>
          <div className="mt-4">
            <h2 className="mb-4 text-2xl font-semibold ">
              <span className="text-[#6e6dfb]">Chapter</span> List
            </h2>
            <ul className="flex flex-col max-h-[596px] gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6e6dfb] scrollbar-track-[#3b3c4c] pr-1">
              {data?.chapters.length > 0 ? 
                data?.chapters.map((chapter) => (
                  <Link href={`/${chapter.slug}`} key={chapter.id}>
                  <li className="bg-[#3b3c4c] text-[#9ca9b9] rounded-md flex gap-2 p-1 hover:bg-[#6e6dfb] hover:text-white group">
                    <div className="p-3 bg-[#48495b] rounded-lg group-hover:bg-[#605fe0]">
                      <BookOpen color="#eeeeee" size={24} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-base">Chapter {chapter.chapterNumber}</p>
                      <p className="text-xs">{new Date(chapter.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </li>
                </Link>
                ))
              : <div> No Chapters yet</div>}
            </ul>
            <div className="flex flex-col gap-2">
              <h2 className="w-full py-4 text-2xl font-semibold text-left flex gap-2 items-center">
                <MessageCircle fill="#6e6dfb" color="#6e6dfb" /> Comments
              </h2>
              <DiscussionEmbed
                shortname="komikgan-1"
                config={{
                  url: `https://eeae-104-28-251-244.ngrok-free.app/series/${data?.slug}`,
                  identifier: data?.slug,
                  title: data?.title,
                  language: "id_ID"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SingleSeriesPage;
