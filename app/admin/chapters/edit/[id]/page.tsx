"use client"

import ChapterForm from "@/components/admin/forms/ChapterForm"
import { useGetSingleChapter } from "@/services/chapters/queries"

const EditChapterPage = ({ params }: { params: {id: number} }) => {
  const { data, isPending } = useGetSingleChapter({ id: params.id })

  if (isPending) return <div>Please wait...</div>
  if (!data) return <div>Not Found</div>

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <ChapterForm data={data} />
    </main>
  )
}

export default EditChapterPage