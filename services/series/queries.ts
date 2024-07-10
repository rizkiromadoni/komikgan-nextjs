import api from "@/lib/api"
import prisma from "@/lib/prisma"
import { PostStatus, Status, Type } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

type GetSeriesProps = {
    status?: Status
    type?: Type
    postStatus?: PostStatus
    sortBy?: "id" | "title" | "createdAt" | "updatedAt"
    sort?: "asc" | "desc"
    userId?: string
    limit?: number
    page?: number
    search?: string
}

export const useGetSeries = (args: GetSeriesProps) => {
    return useQuery({
        queryKey: ["series", {...args}],
        queryFn: async () => {
            const limit = (args.limit ? args.limit : 10).toString()
            const page = (args.page ? args.page : 1).toString()

            const response = await api.series.$get({
                query: {
                    status: args.status,
                    type: args.type,
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
                throw new Error("Failed to get series")
            }

            return await response.json()
        },
        staleTime: Infinity
    })
}

type GetSingleSerieProps = {
    id?: number
    slug?: string
}

export const useGetSingleSeries = (queryParams: GetSingleSerieProps) => {
    const query = useQuery({
        queryKey: ["series", {...queryParams}],
        queryFn: async () => {
            const response = await api.series.get.$get({
                query: {
                    id: queryParams.id?.toString(),
                    slug: queryParams.slug
                }
            })

            if (!response.ok) {
                throw new Error("Failed to get serie")
            }

            return await response.json()
        },
        staleTime: Infinity
    })

    return query
}

export const useGetAllSeries = () => {
    return useQuery({
        queryKey: ["series"],
        queryFn: async () => {
            const response = await api.series.all.$get()
            if (!response.ok) {
                throw new Error("Failed to get series")
            }
            return await response.json()
        },
        staleTime: Infinity
    })
}