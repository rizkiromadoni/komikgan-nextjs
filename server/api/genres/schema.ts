import { z } from "zod";

export const GetGenresSchema = z.object({
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    sortBy: z.enum(["id", "name", "updatedAt", "createdAt"]).optional(),
    sort: z.enum(["desc", "asc"]).optional()
})

export const GetSingleGenreSchema = z.object({
    slug: z.string(),
})

export const CreateGenreSchema = z.object({
    name: z.string().min(1)
})

export const EditGenreParams = z.object({
    id: z.coerce.number()
})
export const EditGenreSchema = z.object({
    name: z.string().min(1)
})

export const DeleteGenreParams = z.object({
    id: z.coerce.number()
})