import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { RegisterUserSchema } from "./schema";
import prisma from "@/lib/prisma";
import InvariantError from "@/server/exceptions/InvariantError";

const users = new Hono()

.post(
  "/register",
  zValidator("json", RegisterUserSchema),
  async (c) => {
    const { username, email, password } = c.req.valid("json");

    const isExist = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    if (isExist) {
      throw new InvariantError("Username or email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdminExist = await prisma.user.findFirst({
      where: {
        role: "SUPERADMIN"
      }
    })

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: superAdminExist ? "USER" : "SUPERADMIN"
      },
    });

    return c.json({ message: "User created" }, 201);
  }
);

export default users;
