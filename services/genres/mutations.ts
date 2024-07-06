import api from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

export const useCreateGenre = () => {
    const queryClient = useQueryClient()

    return useMutation<
        InferResponseType<typeof api.genres.$post>,
        Error,
        InferRequestType<typeof api.genres.$post>
    >({
        mutationFn: async ({ json }) => {
            const response = await api.genres.$post({
                json
            })

            if (!response.ok) {
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
        }
    })
}

export const useUpdateGenre = () => {
    const queryClient = useQueryClient()

    return useMutation<
        InferResponseType<typeof api.genres[":id"]["$patch"]>,
        Error,
        InferRequestType<typeof api.genres[":id"]["$patch"]>
    >({
        mutationFn: async ({ param, json }) => {
            const response = await api.genres[":id"].$patch({
                param, json
            })

            if (!response.ok) {
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
        }
    })
}

export const useDeleteGenre = () => {
    const queryClient = useQueryClient()

    return useMutation<
        InferResponseType<typeof api.genres[":id"]["$delete"]>,
        Error,
        InferRequestType<typeof api.genres[":id"]["$delete"]>
    >({
        mutationFn: async ({ param }) => {
            const response = await api.genres[":id"].$delete({
                param
            })

            if (!response.ok) {
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
        }
    })
}