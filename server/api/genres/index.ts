import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";
import { Hono } from "hono";
import { CreateGenreSchema, DeleteGenreParams, EditGenreParams, EditGenreSchema, GetGenresSchema } from "./schema";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@hono/auth-js";
import AuthorizationError from "@/server/exceptions/AuthorizationError";
import InvariantError from "@/server/exceptions/InvariantError";
import { slugify } from "@/lib/utils";

const genres = new Hono<{
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
    zValidator("query", GetGenresSchema),
    async (c) => {
        const query = c.req.valid("query");

        const page = query.page || 1
        const limit = query.limit || 10
        const take = limit === 0 ? undefined : limit
        const skip = (page - 1) * limit ?? 0
        const sortBy = query.sortBy || "id"
        const sort = query.sort || "desc"

        const genres = await prisma.genre.findMany({
            orderBy: {
                updatedAt: sortBy === "updatedAt" ? sort : undefined,
                createdAt: sortBy === "createdAt" ? sort : undefined,
                name: sortBy === "name" ? sort : undefined,
                id: sortBy === "id" ? sort : undefined
            },
            take,
            skip,
            include: {
                _count: {
                    select: {
                        series: true
                    }
                }
            }
        })
        
        const counts = await prisma.genre.count()

        let hasNext = false

        if (genres && genres.length > 0) {
            const nextPage = await prisma.genre.findFirst({
                skip: skip + (take ?? 0),
                orderBy: {
                    updatedAt: sortBy === "updatedAt" ? sort : undefined,
                    createdAt: sortBy === "createdAt" ? sort : undefined,
                    name: sortBy === "name" ? sort : undefined,
                    id: sortBy === "id" ? sort : undefined
                },
            })

            hasNext = nextPage ? true : false
        }

        return c.json({ counts, hasNext, data: genres })
    }
)

.post("/",
  verifyAuth(),
  zValidator("json", CreateGenreSchema),
  async (c) => {
    const { session } = c.get("authUser")
    const { name } = c.req.valid("json");

    if (session.user.role === "USER") {
      throw new AuthorizationError("You dont have access to this resource");
    }

    const slug = slugify(name);
    const isExist = await prisma.genre.findUnique({
      where: { slug },
    });

    if (isExist) {
      throw new InvariantError("Genre already exist");
    }

    const newGenre = await prisma.genre.create({
      data: {
        name,
        slug
      }
    })

    return c.json(newGenre)
  }
)
.patch("/:id", 
  verifyAuth(),
  zValidator("param", EditGenreParams),
  zValidator("json", EditGenreSchema),
  async (c) => {
    const { session } = c.get("authUser");
      const { id } = c.req.valid("param");
      const { name } = c.req.valid("json");

      if (session.user.role === "USER") {
        throw new AuthorizationError("You dont have access to this resource");
      }

      const genre = await prisma.genre.findUnique({ where: { id } });
      if (!genre) {
        throw new InvariantError("Genre not found");
      }

      const slug = slugify(name);
      const isExist = await prisma.genre.findUnique({
        where: { slug },
      });

      if (isExist) {
        throw new InvariantError("Genre already exist");
      }

      const updatedGenre = await prisma.genre.update({
        where: { id },
        data: {
          name,
          slug
        }
      })

      return c.json(updatedGenre)
  }
)

.delete(
  "/:id",
  verifyAuth(),
  zValidator("param", DeleteGenreParams),
  async (c) => {
    const { session } = c.get("authUser");
    const { id } = c.req.valid("param");

    if (session.user.role === "USER") {
      throw new AuthorizationError("You dont have access to this resource");
    }

    const genre = await prisma.genre.findUnique({ where: { id } });
    if (!genre) {
      throw new InvariantError("Genre not found");
    }

    const deletedSerie = await prisma.genre.delete({ where: { id } });

    return c.json(deletedSerie);
  }
);

export default genres