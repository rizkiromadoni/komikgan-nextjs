import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useCreateSerie = () => {
  const mutation = useMutation<
    InferResponseType<typeof api.series.$post>,
    Error,
    InferRequestType<typeof api.series.$post>
  >({
    mutationFn: async ({ json }) => {
      const response = await api.series.$post({ json });
      if (!response.ok) {
        throw new Error("Failed to create serie");
      }

      return await response.json();
    }
  });

  return mutation;
};
