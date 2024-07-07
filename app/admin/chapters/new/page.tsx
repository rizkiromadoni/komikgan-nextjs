"use client"

import ChapterForm from '@/components/admin/forms/ChapterForm'

const NewChapterPage = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <ChapterForm />
    </main>
  )
}

export default NewChapterPage