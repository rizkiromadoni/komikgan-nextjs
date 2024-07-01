import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  CreateSerieSchema,
  DeleteSerieParams,
  EditSerieParams,
  EditSerieSchema,
  GetSeriesSchema,
  GetSingleSerieSchema,
} from "./schema";
import { Role } from "@prisma/client";
import AuthorizationError from "@/server/exceptions/AuthorizationError";
import { slugify } from "@/lib/utils";
import prisma from "@/lib/prisma";
import InvariantError from "@/server/exceptions/InvariantError";
import fs from "fs-extra";
import path from "path";

const series = new Hono<{
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

  .get("/get", zValidator("query", GetSingleSerieSchema), async (c) => {
    const { id, slug } = c.req.valid("query");

    if (!id && !slug) {
      throw new InvariantError("id or slug is required");
    }

    const serie = await prisma.serie.findFirst({
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
      },
    });

    return c.json(serie);
  })

  .get("/", zValidator("query", GetSeriesSchema), async (c) => {
    const query = c.req.valid("query");

    const series = await prisma.serie.findMany({
      where: {
        status: query.status,
        type: query.type,
        postStatus: query.postStatus,
        userId: query.userId,
      },
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return c.json(series);
  })

  .post("/", verifyAuth(), zValidator("json", CreateSerieSchema), async (c) => {
    const { session } = c.get("authUser");
    const payload = c.req.valid("json");

    if (session.user.role === "USER") {
      throw new AuthorizationError("You dont have access to this resource");
    }

    const slug = slugify(payload.title);
    const isExist = await prisma.serie.findUnique({
      where: { slug },
    });

    if (isExist) {
      throw new InvariantError("Serie already exist");
    }

    let image = payload.image_url ?? undefined;
    if (payload.image) {
      const base64Data = payload.image.split(";base64,").pop();
      const filePath = path.join(
        process.cwd(),
        "public",
        "series",
        slug + ".png"
      );

      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, base64Data as string, {
        encoding: "base64",
      });

      image = filePath.replace(path.join(process.cwd(), "public"), "");
    }

    const serie = await prisma.serie.create({
      data: {
        ...payload,
        slug,
        image,
        userId: session.user.id,
      },
    });

    return c.json(serie, 201);
  })

  .patch(
    "/:id",
    verifyAuth(),
    zValidator("param", EditSerieParams, (result, c) => {
      if (!result.success) {
        return c.json({ message: result.error.message }, 400);
      }
    }),
    zValidator("json", EditSerieSchema, (result, c) => {
      if (!result.success) {
        return c.json({ message: result.error.message }, 400);
      }
    }),
    async (c) => {
      const { session } = c.get("authUser");
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");

      if (session.user.role === "USER") {
        throw new AuthorizationError("You dont have access to this resource");
      }

      const serie = await prisma.serie.findUnique({ where: { id } });
      if (!serie) {
        throw new InvariantError("Serie not found");
      }

      let title = undefined;
      let slug = undefined;
      if (data.title && data.title !== serie.title) {
        title = data.title;
        slug = slugify(data.title);

        const isExist = await prisma.serie.findUnique({
          where: { slug },
        });

        if (isExist) {
          throw new InvariantError("Serie already exist");
        }
      }

      let image = data.image_url ?? undefined;
      if (data.image) {
        if (!data.image.startsWith("/")) {
          const base64Data = data.image.split(";base64,").pop();
          const filePath = path.join(
            process.cwd(),
            "public",
            "series",
            slug ?? serie.slug + ".png"
          );

          await fs.ensureDir(path.dirname(filePath));
          await fs.writeFile(filePath, base64Data as string, {
            encoding: "base64",
          });

          image = filePath.replace(path.join(process.cwd(), "public"), "");
        } else {
          image = data.image;
        }
      }

      const updatedSerie = await prisma.serie.update({
        where: { id },
        data: {
          ...data,
          title,
          slug,
          image,
        },
      });

      return c.json(updatedSerie);
    }
  )

  .delete(
    "/:id",
    verifyAuth(),
    zValidator("param", DeleteSerieParams),
    async (c) => {
      const { session } = c.get("authUser");
      const { id } = c.req.valid("param");

      if (session.user.role === "USER") {
        throw new AuthorizationError("You dont have access to this resource");
      }

      const serie = await prisma.serie.findUnique({ where: { id } });
      if (!serie) {
        throw new InvariantError("Serie not found");
      }

      const deletedSerie = await prisma.serie.delete({ where: { id } });

      return c.json(deletedSerie);
    }
  );

export default series;