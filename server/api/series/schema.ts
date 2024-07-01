import { z } from "zod";
import { PostStatus, Status, Type } from "@prisma/client";

export const CreateSerieSchema = z.object({
    title: z.string().min(1).max(225),
    description: z.string().min(1).max(225),
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