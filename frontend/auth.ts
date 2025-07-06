import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
 callbacks: {
    async jwt({ token, user }) {
  if (user) {
    const u = user as {
      id: string;
      role: string;
      phonenumber?: string;
      identification?: string;
    };

    token.id = u.id;
    token.role = u.role;
    token.phonenumber = u.phonenumber;
    token.identification = u.identification;
  }
  console.log("JWT Callback:", token);
    console.log("JWT Callback:", user);

  return token;
},

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.phonenumber = token.phonenumber as string
        session.user.role = token.role as string
        session.user.identification = token.identification as string
      }
          console.log("JWT Callback:", session.user);
          console.log("JWT Callback:", session);

      return session
    }
  },
  session: {
    strategy: "jwt",
        maxAge: 21600, 

  },
  jwt: {
    maxAge: 21600, 
  },
  ...authConfig
})
