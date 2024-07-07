import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";
import { Hono } from "hono";
import {
  CreateChapterSchema,
  DeleteChapterParams,
  EditChapterParams,
  EditChapterSchema,
  GetChaptersSchema,
  GetSingleChapterSchema,
} from "./schema";
import AuthorizationError from "@/server/exceptions/AuthorizationError";
import { slugify } from "@/lib/utils";
import prisma from "@/lib/prisma";
import InvariantError from "@/server/exceptions/InvariantError";
import NotFoundError from "@/server/exceptions/NotFoundError";

const chapters = new Hono<{
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

  .get("/get", zValidator("query", GetSingleChapterSchema), async (c) => {
    const { id, slug } = c.req.valid("query");

    if (!id && !slug) {
      throw new InvariantError("id or slug is required");
    }

    const chapter = await prisma.chapter.findFirst({
      where: {
        OR: [{ id }, { slug }],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        serie: true
      },
    });
    if (!chapter) {
      throw new NotFoundError("Chapter not Found");
    }

    return c.json(chapter);
  })

  .get("/", zValidator("query", GetChaptersSchema), async (c) => {
    const query = c.req.valid("query");

    const page = query.page || 1;
    const limit = query.limit || 10;
    const take = limit === 0 ? undefined : limit;
    const skip = (page - 1) * limit ?? 0;
    const sortBy = query.sortBy || "updatedAt";
    const sort = query.sort || "desc";
    const search = query.search;

    const series = await prisma.chapter.findMany({
      where: {
        postStatus: query.postStatus,
        userId: query.userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: sortBy === "updatedAt" ? sort : undefined,
        createdAt: sortBy === "createdAt" ? sort : undefined,
        title: sortBy === "title" ? sort : undefined,
        id: sortBy === "id" ? sort : undefined,
      },
      take,
      skip,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    let hasNext = false;

    if (series && series.length > 0) {
      const nextPage = await prisma.chapter.findFirst({
        where: {
          postStatus: query.postStatus,
          userId: query.userId,
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        skip: skip + (take ?? 0),
        orderBy: {
          updatedAt: sortBy === "updatedAt" ? sort : undefined,
          createdAt: sortBy === "createdAt" ? sort : undefined,
          title: sortBy === "title" ? sort : undefined,
          id: sortBy === "id" ? sort : undefined,
        },
      });

      hasNext = nextPage ? true : false;
    }

    const counts = await prisma.chapter.count({
      where: {
        postStatus: query.postStatus,
        userId: query.userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return c.json({ hasNext, counts, data: series });
  })

  .post(
    "/",
    verifyAuth(),
    zValidator("json", CreateChapterSchema),
    async (c) => {
      const { session } = c.get("authUser");
      const { title, content, postStatus, chapterNumber, seriesId } =
        c.req.valid("json");

      if (session.user.role === "USER") {
        throw new AuthorizationError("You dont have access to this resource");
      }

      const serie = await prisma.serie.findUnique({ where: { id: seriesId } });
      if (!serie) {
        throw new NotFoundError("Series not found");
      }

      const slug = slugify(title);

      const isExist = await prisma.chapter.findFirst({
        where: { OR: [{ slug }, { serieId: seriesId, chapterNumber }] },
      });

      if (isExist) {
        throw new InvariantError("Chapter already exist");
      }

      const newChapter = await prisma.chapter.create({
        data: {
          title,
          content,
          postStatus,
          slug,
          chapterNumber,
          serieId: seriesId,
          userId: session.user.id,
        },
      });

      await prisma.serie.update({
        where: { id: seriesId },
        data: {
          updatedAt: new Date(Date.now()),
        },
      });

      return c.json(newChapter);
    }
  )

  .patch(
    "/:id",
    verifyAuth(),
    zValidator("param", EditChapterParams),
    zValidator("json", EditChapterSchema),
    async (c) => {
      const { session } = c.get("authUser");
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");

      if (session.user.role === "USER") {
        throw new AuthorizationError("You dont have access to this resource");
      }

      const chapter = await prisma.chapter.findUnique({ where: { id } });
      if (!chapter) {
        throw new NotFoundError("Chapter not found");
      }

      let title = undefined;
      let slug = undefined;
      if (data.title && data.title !== chapter.title) {
        title = data.title;
        slug = slugify(data.title);

        const isExist = await prisma.chapter.findUnique({
          where: { slug },
        });

        if (isExist) {
          throw new InvariantError("Chapter already exist");
        }
      }

      if (data.seriesId) {
        const series = await prisma.serie.findUnique({ where: { id: data.seriesId } })
        if (!series) {
          throw new NotFoundError("Serie Not Found")
        }
      }

      const updatedChapter = await prisma.chapter.update({
        where: { id },
        data: {
          title,
          slug,
          content: data.content,
          serieId: data.seriesId,
          postStatus: data.postStatus,
          chapterNumber: data.chapterNumber
        },
      });

      return c.json(updatedChapter);
    }
  )

  .delete(
    "/:id",
    verifyAuth(),
    zValidator("param", DeleteChapterParams),
    async (c) => {
      const { session } = c.get("authUser");
      const { id } = c.req.valid("param");

      if (session.user.role === "USER") {
        throw new AuthorizationError("You dont have access to this resource");
      }

      const chapter = await prisma.chapter.findUnique({ where: { id } });
      if (!chapter) {
        throw new InvariantError("Chapter not found");
      }

      const deletedChapter = await prisma.chapter.delete({ where: { id } });

      return c.json(deletedChapter);
    }
  );

export default chapters;
