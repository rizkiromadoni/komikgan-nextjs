import { PostStatus } from "@prisma/client";
import { z } from "zod";

export const GetSingleChapterSchema = z.object({
    id: z.coerce.number().optional(),
    slug: z.string().optional()
})

export const GetChaptersSchema = z.object({
    postStatus: z.nativeEnum(PostStatus).optional(),
    userId: z.string().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    sortBy: z.enum(["id", "title", "updatedAt", "createdAt"]).optional(),
    sort: z.enum(["desc", "asc"]).optional(),
    search: z.string().optional()
})

export const CreateChapterSchema = z.object({
    title: z.string().min(1).max(225),
    content: z.string().min(1),
    postStatus: z.nativeEnum(PostStatus),
    chapterNumber: z.string().min(1),
    seriesId: z.number()
})

export const EditChapterParams = z.object({
    id: z.coerce.number()
})

export const EditChapterSchema = z.object({
    title: z.string().max(225).optional(),
    content: z.string().optional(),
    postStatus: z.nativeEnum(PostStatus).optional(),
    chapterNumber: z.string().min(1).optional(),
    seriesId: z.number().optional()
})

export const DeleteChapterParams = z.object({
    id: z.coerce.number()
})