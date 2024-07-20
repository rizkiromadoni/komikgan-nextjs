import SearchSeries from "@/components/SearchSeries"
import { Suspense } from "react"

const SearchSeriesPage = ({ params }: { params: { query: string }}) => {
  return (
    <main className="max-w-5xl mx-auto p-2 mb-10">
        <Suspense>
            <SearchSeries query={params.query} />
        </Suspense>
    </main>
  )
}

export default SearchSeriesPage