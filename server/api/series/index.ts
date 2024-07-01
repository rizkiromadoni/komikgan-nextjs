import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateSerieSchema } from "./schema";
import { Role } from "@prisma/client";
import AuthorizationError from "@/server/exceptions/AuthorizationError";
import { slugify } from "@/lib/utils";
import prisma from "@/lib/prisma";
import InvariantError from "@/server/exceptions/InvariantError";
import { z } from "zod";
import fs from "fs-extra";
import path from "path";

const series = new Hono<{ Variables: {
    authUser: {
        session: {
            user: {
                email: string
                image: string | null
                id: string
                role: Role
                username: string
            }
        }
    }
}}>()

.post("/",
    verifyAuth(),
    zValidator("json", CreateSerieSchema),
    async (c) => {
        const { session } = c.get("authUser")
        const payload = c.req.valid("json")

        if (session.user.role === "USER") {
            throw new AuthorizationError("You dont have access to this resource")
        }

        const slug = slugify(payload.title)
        const isExist = await prisma.serie.findUnique({
            where: { slug }
        })

        if (isExist) {
            throw new InvariantError("Serie already exist")
        }

        let image = payload.image_url ?? undefined
        if (payload.image) {
            const base64Data = payload.image.split(";base64,").pop()
            const filePath = path.join(process.cwd(), "public", "series", slug + ".png")

            await fs.ensureDir(path.dirname(filePath))
            await fs.writeFile(filePath, base64Data as string, { encoding: "base64" })

            image = filePath.replace(path.join(process.cwd(), "public"), "")
        }

        const serie = await prisma.serie.create({
            data: {
                ...payload,
                slug,
                image,
                userId: session.user.id
            }
        })

        return c.json(serie, 201)
    }
)

export default series