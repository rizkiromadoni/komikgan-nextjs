import api from "@/lib/api"
import { PostStatus, Status, Type } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

type GetSeriesProps = {
    status?: Status
    type?: Type
    postStatus?: PostStatus
    userId?: string
    limit?: number
    page?: number
}

export const useGetSeries = (queryParams: GetSeriesProps) => {
    const query = useQuery({
        queryKey: ["series"],
        queryFn: async () => {
            const limit = (queryParams.limit ? queryParams.limit : 10).toString()
            const page = (queryParams.page ? queryParams.page : 1).toString()

            const response = await api.series.$get({
                query: {
                    status: queryParams.status,
                    type: queryParams.type,
                    postStatus: queryParams.postStatus,
                    userId: queryParams.userId,
                    limit: limit,
                    page: page
                }
            })

            if (!response.ok) {
                throw new Error("Failed to get series")
            }

            return await response.json()
        }
    })

    return query
}

type GetSingleSerieProps = {
    id?: number
    slug?: string
}

export const useGetSingleSeries = (queryParams: GetSingleSerieProps) => {
    const query = useQuery({
        queryKey: ["series", queryParams],
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
        }
    })

    return query
}