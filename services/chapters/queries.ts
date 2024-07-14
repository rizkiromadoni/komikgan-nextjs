import api from "@/lib/api"
import { PostStatus } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

type GetChaptersProps = {
    postStatus?: PostStatus
    sortBy?: "id" | "title" | "createdAt" | "updatedAt"
    sort?: "asc" | "desc"
    userId?: string
    limit?: number
    page?: number
    search?: string
}

export const useGetChapters = (args: GetChaptersProps) => {
    return useQuery({
        queryKey: ["chapters", {...args}],
        queryFn: async () => {
            const limit = (args.limit ? args.limit : 10).toString()
            const page = (args.page ? args.page : 1).toString()

            const response = await api.chapters.$get({
                query: {
                    postStatus: args.postStatus,
                    userId: args.userId,
                    sortBy: args.sortBy,
                    sort: args.sort,
                    limit: limit,
                    page: page,
                    search: args.search
                }
            })

            if (!response.ok) {
                throw new Error("Failed to get chapters")
            }

            return await response.json()
        },
        staleTime: Infinity
    })
}

type GetSingleChapterProps = {
    id?: number
    slug?: string
}

export const useGetSingleChapter = (args: GetSingleChapterProps) => {
    return useQuery({
        queryKey: ["chapters", {...args}],
        queryFn: async () => {
            const response = await api.chapters.get.$get({
                query: {
                    id: args.id?.toString(),
                    slug: args.slug
                }
            })

            if (!response.ok) {
                throw new Error("Failed to get chapter")
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        retry: false,
        staleTime: Infinity
    })
}