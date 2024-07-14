import { z } from "zod";

export const UpdateProfileSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    image: z.string().optional(),
})