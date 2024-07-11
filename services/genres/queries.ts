import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetGenres = (args: {
  page: string;
  limit: string;
  sortBy: string;
  sort: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["genres", {...args}],
    queryFn: async () => {
      const response = await api.genres.$get({
        query: {
          limit: args.limit,
          page: args.page,
          sortBy: args.sortBy,
          sort: args.sort
        },
      });

      return await response.json();
    },
    staleTime: Infinity,
  });
};

export const useGetSingleGenre = (args: {
  slug: string
}) => {
  return useQuery({
    queryKey: ["genres", {...args}],
    queryFn: async () => {
      const response = await api.genres.get.$get({
        query: {
          slug: args.slug
        }
      })

      return await response.json();
    },
    staleTime: Infinity,
  });
};

export const useGetAllGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await api.genres.all.$get();
      return await response.json();
    },
    staleTime: Infinity,
  });
}
