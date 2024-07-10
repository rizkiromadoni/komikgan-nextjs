"use client";

import { useGetAllGenres } from "@/services/genres/queries";
import Link from "next/link";

const GenreListPage = () => {
  const { data, isPending } = useGetAllGenres();

  if (isPending) return <p>Please wait...</p>;
  if (!data) return <p>There are no genres yet.</p>;

  return (
    <main className="max-w-5xl mx-auto p-2 mb-10">
      <h2 className="w-full py-4 text-2xl font-semibold text-left">
        <span className="text-[#3453d1]">Genre</span> List
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {data.map((genre) => (
          <li key={genre.id}>
            <Link
              href={`/genres/${genre.slug}`}
              className="flex justify-between items-center p-3 text-[#9ca9b9] bg-[#3b3c4c] hover:text-white hover:bg-[#6e6dfb] transition-colors rounded-md"
            >
              <span>{genre.name}</span>
              <span>{genre._count.series}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default GenreListPage;
