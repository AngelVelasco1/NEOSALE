import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google,
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);
        if (!success) {
          return null;
        }
        /* Verify User Credentials */
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });
        console.log(user );
        

        if (!user?.name || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          data.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        /* Verify Email */
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
          throw new Error('Revisa el email de verificacion')
        }  */

        return {
          id: user.id.toString(),
          name: user?.name,
          email: user?.email,
          image: user?.image,
          emailverified: user?.emailVerified,
          phoneNumber: user?.phonenumber,
          identification: user?.identification,
          role: user?.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
