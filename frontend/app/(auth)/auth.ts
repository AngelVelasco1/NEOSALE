import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../../lib/prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/api/auth/error',
  },
  session: {
    strategy: "jwt",
        maxAge: 3600,
  },
  jwt: {
    maxAge: 3600
  },
  events: {
    async createUser({ user }) {
      // Asegurar que el usuario creado con OAuth tenga el rol correcto
      await prisma.user.update({
        where: { id: Number(user.id) },
        data: { role: "user" }
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          });

          if (existingUser) {
            const hasProviderAccount = existingUser.accounts.some(
              (acc) => acc.provider === account.provider
            );

            if (!hasProviderAccount) {
              // Email ya existe con credentials - vincular automáticamente
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refreshToken: account.refresh_token ?? null,
                  accessToken: account.access_token ?? null,
                  expiresAt: account.expires_at ? Number(account.expires_at) : null,
                  tokenType: account.token_type ?? null,
                  scope: account.scope ?? null,
                  idToken: account.id_token ?? null,
                  sessionState: account.session_state ?? null,
                }
              });

              return true;
            }
          }
        } catch (error) {
          console.error(`Error en signIn callback (${account.provider}):`, error);
          return `/login?error=${encodeURIComponent('Error al vincular la cuenta')}`;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
 
})
