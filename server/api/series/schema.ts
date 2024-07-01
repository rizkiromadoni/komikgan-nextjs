import { z } from "zod";
import { PostStatus, Status, Type } from "@prisma/client";

export const CreateSerieSchema = z.object({
    title: z.string().min(1).max(225),
    description: z.string().min(1),
    status: z.nativeEnum(Status).default(Status.ONGOING),
    type: z.nativeEnum(Type).default(Type.MANGA),
    postStatus: z.nativeEnum(PostStatus).default(PostStatus.PUBLISHED),
    image_url: z.string().max(225).optional(),
    image: z.string().optional(),
    alternative: z.string().max(225).optional(),
    author: z.string().max(225).optional(),
    artist: z.string().max(225).optional(),
    serialization: z.string().max(225).optional(),
    released: z.string().max(225).optional(),
    rating: z.string().max(225).optional(),
})

export const GetSeriesSchema = z.object({
    status: z.nativeEnum(Status).optional(),
    type: z.nativeEnum(Type).optional(),
    postStatus: z.nativeEnum(PostStatus).optional(),
    userId: z.string().optional(),
    limit: z.coerce.number().default(10),
    page: z.coerce.number().default(1),
})

export const GetSingleSerieSchema = z.object({
    id: z.coerce.number().optional(),
    slug: z.string().optional()
})

export const EditSerieParams = z.object({
    id: z.coerce.number()
})

export const EditSerieSchema = z.object({
    title: z.string().max(225).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
    type: z.nativeEnum(Type).optional(),
    postStatus: z.nativeEnum(PostStatus).optional(),
    image_url: z.string().max(225).optional(),
    image: z.string().optional(),
    alternative: z.string().max(225).optional(),
    author: z.string().max(225).optional(),
    artist: z.string().max(225).optional(),
    serialization: z.string().max(225).optional(),
    released: z.string().max(225).optional(),
    rating: z.string().max(225).optional(),
    userId: z.string().optional()
})

export const DeleteSerieParams = z.object({
    id: z.coerce.number()
})