import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "./lib/zod"
import bcrypt from "bcryptjs"
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials)
        if (!success) {
          return null
        }

        const user = await prisma.users.findUnique({
          where: {
            email: data.email,
          }
        })

        if (!user.name || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailverified,
          phoneNumber: user?.phonenumber,
          identification: user?.identification,
          role: user?.role,
        };
      },
    }),
  ]
} satisfies NextAuthConfig