import SeriesByGenre from "@/components/SeriesByGenre"
import { Suspense } from "react"

const SingleGenrePage = ({ params }: { params: { slug: string } }) => {
  return (
    <main className="max-w-5xl mx-auto p-2 mb-10">
      <Suspense>
        <SeriesByGenre slug={params.slug} />
      </Suspense>
    </main>
  )
}

export default SingleGenrePage