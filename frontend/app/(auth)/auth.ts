import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../../lib/prisma"
import authConfig from "./auth.config"
import type { Adapter } from "next-auth/adapters"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  ...authConfig,
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/api/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour to check expiration
  },
  jwt: {
    maxAge: 24 * 60 * 60 // 24 hours
  },
  // Reduce callback executions
  useSecureCookies: process.env.NODE_ENV === 'production',
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
                  sessionState: typeof account.session_state === 'string' ? account.session_state : null,
                }
              });

              return true;
            }
          }
        } catch (error) {
          return `/login?error=${encodeURIComponent('Error al vincular la cuenta')}`;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // On sign in, get user data with role — only runs once
      if (user) {
        token.role = user.role;
        return token;
      }

      // Only fetch role from DB if it's missing in the token
      // (handles existing sessions that predate this optimization)
      if (token.sub && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: Number(token.sub) },
            select: { role: true }
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (error) {
          // If lookup fails, keep as user
          token.role = "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Minimal session callback to reduce processing
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },

})
