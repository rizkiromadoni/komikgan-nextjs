import NextAuth, { NextAuthConfig, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id?: string
    email?: string | null
    username: string
    role: Role
    image?: string | null
  }

  interface Session {
    user: {
      id: string
      email: string | null
      username: string
      role: Role
      image: string | null
    }
  }
}

import { JWT } from "next-auth/jwt"
 
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    email?: string | null
    role: Role
    image?: string | null
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        const { email, password } = credentials as any;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.username = user.username
        token.role = user.role
        token.image = user.image

        if (user.id) {
          token.id = user.id
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.username = token.username
        session.user.image = token.image || null
      }

      return session
    }
  },
  pages: {
    signIn: "/login",
    newUser: "/register"
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
