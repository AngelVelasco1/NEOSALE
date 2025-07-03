import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 21600, 
  },
  jwt: {
    maxAge: 21600, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.phoneNumber = user.phonenumber 
      }      
      console.log(user);
      
      return token
      
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.email = token.email
        session.user.phonenumber = token.phonenumber 
      }
            console.log(session);


      return session
    }
  },
  ...authConfig
})
