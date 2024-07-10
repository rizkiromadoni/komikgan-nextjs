"use client"

import { useGetAllSeries } from "@/services/series/queries";
import Link from "next/link";

const alphabetUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const SeriesPage = () => {
  const { data, isPending } = useGetAllSeries()

  if (isPending) return <p>Please wait...</p>
  if (!data) return <p>There are no series yet.</p>

  return (
    <main className="max-w-5xl mx-auto p-2">
      <h2 className="w-full py-4 text-2xl font-semibold text-left">
        <span className="text-[#3453d1]">Manga</span> List
      </h2>
      <ul className="flex justify-center pb-4 flex-wrap border-b-4 border-[#6e6dfb]">
        {alphabetUpperCase.map((letter) => (
          <Link
            key={letter}
            href={`#${letter}`}
            className="px-3 py-2 text-[#9ca9b9] hover:bg-[#6e6dfb] hover:text-white rounded-md transition-colors"
          >
            <li>{letter}</li>
          </Link>
        ))}
      </ul>

      <ul className="p-2 flex gap-2 flex-col">
        {alphabetUpperCase.map((letter) => {
            const filtered = data.filter((value) => {
                return value.title.toUpperCase().startsWith(letter)
            })

            if (filtered.length < 1) return null

            return (
                <li
                  className="flex gap-10 pb-4 border-b-2 border-dashed border-[#45475a]"
                  key={letter}
                  id={letter}
                >
                  <h2 className="text-xl py-3 px-4 bg-[#45475a] text-white rounded-md h-fit">
                    {letter}
                  </h2>
                  <ul className="list-[square]">
                    {filtered.map(item => (
                        <li className="text-red-500" key={item.id}>
                        <Link
                          href={`/series/${item.slug}`}
                          className="text-[#9ca9b9] hover:text-white transition-colors"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )
        })}
      </ul>
    </main>
  );
};

export default SeriesPage;
