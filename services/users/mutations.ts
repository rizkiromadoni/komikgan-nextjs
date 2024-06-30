import api from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

export const useRegisterUser = () => {
    const mutation = useMutation<
        InferResponseType<typeof api.users.register.$post>,
        Error,
        InferRequestType<typeof api.users.register.$post>
    >({
        mutationFn: async ({ json }) => {
            const response = await api.users.register.$post({ json })
            if (!response.ok) {
                throw new Error("Failed to register user")
            }

            return await response.json()
        },
    })

    return mutation
}