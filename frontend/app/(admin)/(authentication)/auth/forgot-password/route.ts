import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { passwordResetFormSchema } from "@/app/(admin)/(authentication)/forgot-password/_components/schema";
import validateFormData from "@/app/(admin)/helpers/validateFormData";
import { sendPasswordResetEmail } from "@/lib/passwordResetEmail";
import { createResetToken, RESET_TOKEN_EXPIRATION_MINUTES } from "@/lib/resetToken";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const { errors } = validateFormData(passwordResetFormSchema, { email });

    if (errors) {
      return NextResponse.json({ errors }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return NextResponse.json({ success: true });
    }

    const { token } = createResetToken(user.id, user.email);

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name ?? "Cliente NEOSALE",
      token,
      expiresInMinutes: RESET_TOKEN_EXPIRATION_MINUTES,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json(
      {
        errors: {
          email: "No pudimos procesar la solicitud. Inténtalo nuevamente en unos minutos.",
        },
      },
      { status: 500 }
    );
  }
}
