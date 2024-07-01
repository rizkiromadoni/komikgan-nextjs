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
        const { message } = await response.json() as any
        throw new Error(message);
      }

      return await response.json();
    }
  });

  return mutation;
};

export const useEditSerie = () => {
  const mutation = useMutation<
    InferResponseType<typeof api.series[":id"]["$patch"]>,
    Error,
    InferRequestType<typeof api.series[":id"]["$patch"]>
  >({
    mutationFn: async ({ param, json }) => {
      const response = await api.series[":id"].$patch({ param, json });
      if (!response.ok) {
        const { message } = await response.json() as any
        throw new Error(message);
      }

      return await response.json();
    }
  });

  return mutation;
};
