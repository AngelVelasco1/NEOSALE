import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "../../lib/zod";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

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

          /*   if (!user.emailVerified) {
          const tokenExists = await prisma.verificationToken.findFirst({
            where: {
              identifier: user.email,
            },
          });
          if(tokenExists?.identifier) {
            await prisma.verificationToken.delete({
              where: {
                identifier: user.email
              }
            })
          }

          const emailToken = nanoid();

          await prisma.verificationToken.create({
            data: {
              identifier: user.email,
              token: emailToken,
              expires: new Date(Date.now() + 1140),
            },
          })
            throw new AuthError('Email no verificado. Revisa tu bandeja de entrada', 'EMAIL_NOT_VERIFIED');
          }  */
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.email_verified,
            image: user.image,
            password: user.password,
            phonenumber: user.phone_number,
            identification: user.identification,
          };
        } catch (error) {
          console.error("Auth error", error);
          return null;
        }
      },
    }),
    Google
  ],
} satisfies NextAuthConfig;
