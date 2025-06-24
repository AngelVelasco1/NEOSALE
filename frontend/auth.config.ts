import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "../backend/lib/prisma"
import { loginSchema } from "./lib/zod"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
     Credentials({ 
      authorize: async (credentials) => {
          const {data, success} =  loginSchema.safeParse(credentials)
          if(!success) {
            throw new Error('Invalid')
          }

          const user = prisma.users.findUnique({
            where: {
              email: data.email,
              password: data.password
            }
          })
      },
    }),
  ],
} satisfies NextAuthConfig