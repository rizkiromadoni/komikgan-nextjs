"use client"

import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function getBookmarks() {
  const response = await api.bookmarks.$get()
  return await response.json()
}

const BookmarksPage = () => {
  const { data: session, status } = useSession()

  const { data, isPending } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => await getBookmarks(),
    retry: false
  })

  if (isPending) return (
    <main className='flex flex-col justify-center items-center w-full h-96'>
      <h1 className='text-2xl font-bold'>
          Loading...
      </h1>
    </main>
  )

  if (status === "unauthenticated") return (
    <main className='flex flex-col justify-center items-center w-full h-96'>
      <h1 className='text-2xl font-bold'>
          401 UNAUTHORIZED
      </h1>
      <p className='text-sm text-[#9ca9b9] px-10 text-center'>
          You need to Login to View Your Bookmarks
      </p>
    </main>
  )

  return (
    <main className='max-w-5xl mx-auto p-2'>
      <h2 className="w-full py-4 text-2xl font-semibold text-left">
        <span className="text-[#3453d1]">Bookmark</span> List
      </h2>
      {data && data?.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {data.map((item) => (
            <Link
              href={`/series/${item.slug}`}
              className="flex flex-col gap-2 hover:text-[#3453d1]"
              key={item.id}
            >
              <Image
                src={item.image || "/no-image.jpg"}
                alt={item.title}
                className="w-full h-56 rounded-md shadow-md"
                width={250}
                height={344}
              />
              <h2 className="text-sm text-center">{item.title}</h2>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center">
          No Series Found
        </div>
      )}
    </main>
  )
}

export default BookmarksPage