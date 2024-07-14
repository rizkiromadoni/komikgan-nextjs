import prisma from "@/lib/prisma";
import AuthenticationError from "@/server/exceptions/AuthenticationError";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { type Role } from "@prisma/client";
import { Hono } from "hono";
import { UpdateProfileSchema } from "./schema";
import InvariantError from "@/server/exceptions/InvariantError";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs-extra";

const profile = new Hono<{
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

.get("/", verifyAuth(), async (c) => {
  const { session } = c.get("authUser");

  const user = await prisma.user.findFirst({
    where: { id: session.user.id }
  })

  if (!user) {
    throw new AuthenticationError("Unauthenticated user not found");
  }

  return c.json(user)
})

.patch("/", verifyAuth(), zValidator("json", UpdateProfileSchema), async (c) => {
  const { session } = c.get("authUser");
  const data = c.req.valid("json");

  const user = await prisma.user.findFirst({
    where: { id: session.user.id }
  })

  if (!user) {
    throw new AuthenticationError("Unauthenticated user not found");
  }

  if (data.username && user.username !== data.username) {
    const existingUser = await prisma.user.findFirst({
      where: { username: data.username }
    })

    if (existingUser) {
      throw new InvariantError("Username already exists");
    }
  }

  if (data.email && user.email !== data.email) {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new InvariantError("Email already exists");
    }
  }

  let hashedPassword
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10)
  }

  let image;
    if (data.image) {
      const base64Data = data.image.split(";base64,").pop();
      const filePath = path.join(
        process.cwd(),
        "public",
        "profile",
        user.id + ".png"
      );

      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, base64Data as string, {
        encoding: "base64",
      });

      image = filePath.replace(path.join(process.cwd(), "public"), "");
    }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
        username: data.username && data.username !== user.username ? data.username : undefined,
        email: data.email && data.email !== user.email ? data.email : undefined,
        password: hashedPassword,
        image
    }
  })

  return c.json(updatedUser)
})

.delete("/", verifyAuth(), async (c) => {
  const { session } = c.get("authUser");
  const user = await prisma.user.findFirst({
      where: { id: session.user.id }
  })

  if (!user) {
    throw new AuthenticationError("Unauthenticated user not found");
  }

  await prisma.user.delete({ where: { id: user.id } })
  return c.json({ success: true })
})

export default profile
