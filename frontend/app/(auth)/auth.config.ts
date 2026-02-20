import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "../../lib/zod";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook"
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "@/lib/verifyEmail";

export class AuthError extends Error {
  type: string;

  constructor(message: string, type: string) {
    super(message);
    this.name = "AuthError";
    this.type = type;
  }
}

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const { data, success } = loginSchema.safeParse(credentials);
          if (!success) {
            throw new AuthError("Datos de login inválidos", "VALIDATION_ERROR");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: data.email,
            },
          });

          if (!user) {
            throw new AuthError("Usuario Invalido", "USER_NOT_FOUND");
          }

          if (!user.password) {
            throw new AuthError("Usuario sin contraseña configurada", "NO_PASSWORD");
          }

          const isPasswordValid = await bcrypt.compare(data.password, user.password);

          if (!isPasswordValid) {
            throw new AuthError("Contraseña incorrecta", "INVALID_PASSWORD");
          }

          // Si email no verificado, permitir login pero enviar email de verificación
          if (!user.emailVerified) {            
            try {
              // Verificar si ya existe un token válido
              const existingToken = await prisma.verificationToken.findFirst({
                where: {
                  identifier: user.email,
                  expires: {
                    gt: new Date(), // Token aún no expirado
                  },
                },
                orderBy: {
                  expires: 'desc'
                }
              });

              // Solo crear y enviar nuevo token si no existe uno válido
              if (!existingToken) {
                // Limpiar TODOS los tokens del email (incluso expirados)
                await prisma.verificationToken.deleteMany({
                  where: { identifier: user.email },
                });

                const emailToken = nanoid();

                await prisma.verificationToken.create({
                  data: {
                    identifier: user.email,
                    token: emailToken,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                  },
                });


                // Enviar email en background (no bloquear login si falla)
                sendVerificationEmail({
                  email: user.email,
                  token: emailToken,
                  name: user.name || 'Usuario',
                }).catch(err => console.error('Email send error:', err));
              }
            } catch (tokenError: any) {
              console.error('Error manejando token de verificación:', tokenError);
              // NO lanzar error - permitir login incluso si falla la creación del token
            }
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
            image: user.image,
            password: user.password,
            phonenumber: user.phoneNumber,
            identification: user.identification,
          };
        } catch (error) {
          console.error("Auth error", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.emailVerified ? new Date() : null,
          role: "user",
        }
      },
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      authorization: {
        params: {
          scope: "public_profile"
        }
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          emailVerified: new Date(),
          role: "user",
        }
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} satisfies NextAuthConfig;
