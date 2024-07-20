import prisma from "@/lib/prisma";
import NotFoundError from "@/server/exceptions/NotFoundError";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

const bookmarks = new Hono<{
  Variables: {
    authUser: {
      session: {
        user: {
          email: string;
          image: string | null;
          id: string;
          role: Role;
          username: string;
        };
      };
    };
  };
}>()

.get("/",
    verifyAuth(),
    async (c) => {
        const { session } = c.get("authUser");

        const bookmarks = await prisma.serie.findMany({
            where: {
                bookmarks: {
                    some: {
                        userid: session.user.id
                    }
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                image: true
            }
        })

        return c.json(bookmarks)
    }
)

.get("/:id{[0-9]+}",
    verifyAuth(),
    async (c) => {
        const { session } = c.get("authUser");
        const { id } = c.req.param();

        const bookmarked = await prisma.bookmark.findFirst({
            where: {
                serieId: Number(id),
                userid: session.user.id
            }
        })

        return c.json(bookmarked)
    }
)

.post("/",
    verifyAuth(),
    zValidator("json", z.object({
        id: z.coerce.number().positive()
    })),
    async (c) => {
        const { session } = c.get("authUser");
        const { id } = c.req.valid("json");

        const serie = await prisma.serie.findUnique({ where: { id } });
        if (!serie) {
            throw new NotFoundError("Serie not found");
        }

        await prisma.bookmark.create({
            data: {
                serieId: serie.id,
                userid: session.user.id
            }
        })

        return c.json({ success: true })
    }
)

.delete("/:id{[0-9]+}",
    verifyAuth(),
    async (c) => {
        const { session } = c.get("authUser");
        const { id } = c.req.param();

        await prisma.bookmark.deleteMany({
            where: {
                serieId: Number(id),
                userid: session.user.id
            }
        })

        return c.json({ success: true })
    }
)


export default bookmarks