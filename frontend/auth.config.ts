import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "../backend/lib/prisma"
import { loginSchema } from "./lib/zod"
import bcrypt from "bcryptjs"
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
     Credentials({ 
      authorize: async (credentials) => {
          const {data, success} =   loginSchema.safeParse(credentials)
          if(!success) {
            return null
          }

          const user = await prisma.users.findUnique({
            where: {
              email: data.email,
            }
          })

          if (!user || !user.password) {
              return null
          }

          const isPasswordValid = await bcrypt.compare(data.password, user.password);
    
           if (!isPasswordValid) {
              return null
          }

          return user;

      },
    }),
  ],
   callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.email = token.email
      }
      return session
    }
  }
} satisfies NextAuthConfig