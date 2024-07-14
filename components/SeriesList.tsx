import api from "@/lib/api";
import { InferResponseType } from "hono";
import Image from "next/image";
import Link from "next/link";

function formatRelativeTime(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
}

const SeriesList = ({
  data,
}: {
  data?: InferResponseType<typeof api.series.$get>;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.data.map((serie) => (
        <div
          key={serie.id}
          className="pb-4 border-b-2 border-dashed border-[#45475a] flex w-full h-auto gap-2"
        >
          <Link
            href={`/series/${serie.slug}`}
            className="w-24 h-36 border-2 rounded-md border-[#45475a] flex-none overflow-hidden relative"
          >
            <Image
              src={serie.image || "/no-image.jpg"}
              alt={serie.title}
              className="hover:scale-125 transition-all"
              fill
            />
          </Link>
          <div className="w-full h-full truncate ml-2">
            <Link
              href={`/series/${serie.slug}`}
              className="text-[16px] text-[#9ca9b9] font-semibold hover:text-[#3453d1] transition-colors"
            >
              {serie.title}
            </Link>
            <ul className="grid grid-cols-1 gap-1 mt-2">
              {serie.chapters.map((chapter) => (
                <li className="flex justify-between" key={chapter.id}>
                  <Link
                    href={`/${chapter.slug}`}
                    className="px-4 py-1 text-[15px] text-[#eeeeee] bg-[#3b3c4c] rounded-full hover:bg-[#3453d1] hover:text-[#ffffff] transition-colors"
                  >
                    Chapter {chapter.chapterNumber}
                  </Link>
                  <span className="text-[14px] text-[#999999] font-extralight p-[3px]">
                    {formatRelativeTime(chapter.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeriesList;
