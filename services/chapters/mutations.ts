import api from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

export const useCreateChapter = () => {
    const queryClient = useQueryClient()

    return useMutation<
        InferResponseType<typeof api.chapters.$post>,
        Error,
        InferRequestType<typeof api.chapters.$post>
    >({
        mutationFn: async ({ json }) => {
            const response = await api.chapters.$post({ json })
            if (!response.ok) {
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chapters", "series"] })
        }
    })
}

export const useUpdateChapter = () => {
    const queryClient = useQueryClient()

    return useMutation<
        InferResponseType<typeof api.chapters[":id"]["$patch"]>,
        Error,
        InferRequestType<typeof api.chapters[":id"]["$patch"]>
    >({
        mutationFn: async ({ param, json }) => {
            const response = await api.chapters[":id"].$patch({ param, json })
            if (!response.ok) {
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chapters", "series"] })
        }
    })
}

export const useDeleteChapter = () => {
    const queryClient = useQueryClient()

    return useMutation<
        InferResponseType<typeof api.chapters[":id"]["$delete"]>,
        Error,
        InferRequestType<typeof api.chapters[":id"]["$delete"]>
    >({
        mutationFn: async ({ param }) => {
            const response = await api.chapters[":id"].$delete({ param })
            if (!response.ok) {
                const { message } = await response.json() as any
                throw new Error(message)
            }

            return await response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chapters", "series"] })
        }
    })
}

